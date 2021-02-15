import {
  JupyterFrontEnd, JupyterFrontEndPlugin,
} from "@jupyterlab/application";

import {
  Dialog, showDialog,
} from "@jupyterlab/apputils";

import {
  IFileBrowserFactory,
} from "@jupyterlab/filebrowser";

import {
  ILauncher,
} from "@jupyterlab/launcher";

import {
  IMainMenu,
} from "@jupyterlab/mainmenu";

import {
  Widget,
} from "@lumino/widgets";

import { requestAPI } from './handler';

import { UserApi } from '@tiledb-inc/tiledb-cloud';

const extension: JupyterFrontEndPlugin<void> = {
  activate,
  autoStart: true,
  id: "tiledb-prompt-notebook-options",
  optional: [ILauncher],
  requires: [IMainMenu, IFileBrowserFactory],
};

export
class TileDBPromptOptionsWidget extends Widget {

  public constructor(options: {owners: string[], credentials: any[]}) {
    const body = document.createElement("div");

    const name_label = document.createElement("label");
    name_label.textContent = "Name:";
    const name_input = document.createElement("input");
    name_input.setAttribute("type", "text");
    name_input.setAttribute("value", "Untitled");

    const s3_label = document.createElement("label");
    s3_label.textContent = "S3 Path:";
    const s3_input = document.createElement("input");
    s3_input.setAttribute("type", "text");
    s3_input.setAttribute("value", "s3://tiledb-user/notebooks");

    const s3_cred_label = document.createElement("label");
    s3_cred_label.textContent = "S3 Path Credentials:";
    const s3_cred_input = document.createElement("select");
    s3_cred_input.setAttribute("name", "tiledb-user-creds");
    options.credentials.forEach((cred) => {
      const option = document.createElement("option");
      option.setAttribute("value", cred.name);
      option.setAttribute("label", cred.name);
      s3_cred_input.append(option);
    });
    
    const owner_label = document.createElement("label");
    owner_label.textContent = "Owner:";
    const owner_input = document.createElement("select");

    options.owners.forEach((owner) => {
      const option = document.createElement("option");
      option.setAttribute("value", owner);
      option.setAttribute("label", owner);
      owner_input.append(option);
    })
    owner_input.setAttribute("name", "user");

    body.appendChild(name_label);
    body.appendChild(name_input);
    body.appendChild(s3_label);
    body.appendChild(s3_input);
    body.appendChild(s3_cred_label);
    body.appendChild(s3_cred_input);
    body.appendChild(owner_label);
    body.appendChild(owner_input);

    super({ node: body });
  }

  public getValue(): string {
    let input_elem = this.node.getElementsByTagName("input");
    let select_elem = this.node.getElementsByTagName("select");

    return [input_elem[0].value, input_elem[1].value, 
    select_elem[0].value, select_elem[1].value].join(" ");
  }
}

function activate(app: JupyterFrontEnd,
                  menu: IMainMenu,
                  browser: IFileBrowserFactory,
                  launcher: ILauncher | null) {
  const open_command = "tiledb-prompt-notebook-options:open";

  app.commands.addCommand(open_command, {
    caption: "Prompt the user for TileDB notebook options",
    execute: async () => {
      const data: any = await requestAPI();
      const config = {
        apiKey: data.token
      };
      const tileDBAPI = new UserApi(config);
    
      const userResponse = await tileDBAPI.getUser();
      const userData = userResponse.data;
      const username = userData.username;
      const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(username);
      const owners = [username];
      const orgs =  userData.organizations || [];

      orgs.forEach(org => {
        const orgName = (org as any).organization_name;
        if (orgName !== 'public' && !!~(org as any).allowed_actions.indexOf('write' as any)) {
          owners.push(orgName);
        }
      });

      showDialog({
        body: new TileDBPromptOptionsWidget({
          owners,
          credentials: credentialsResponse.data || []
        }),
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: "GO" })],
        title: "TileDB Notebook Options",
      }).then((result : any) => {
        var results = result.value.split(" ");
        if (result.button.label === "Cancel") {
          return;
        } else if (result.button.label === "GO"){
          var tiledb_options_json = 
          {
            name: results[0],
            s3_prefix: results[1],
            s3_credentials: results[2]
          };
          
          return new Promise(() => {
            var path = "cloud/owned/".concat(results[3], "/")
            app.commands.execute(
              "docmanager:new-untitled", { 
              path: path,
              type: "notebook",
              options: JSON.stringify(tiledb_options_json)
            }).then((model: any) => {
                app.commands.execute(
                  "docmanager:open", {
                  factory: "Notebook", 
                  path: model.path + ".ipynb",
                });
              })
          })
        }
      })
    },
    isEnabled: () => true,
    label: "TileDB Notebook",
  });

  // Add a launcher item.
  if (launcher) {
    launcher.add({
      args: { isLauncher: true, kernelName: "tiledb-prompt-notebook-options" },
      category: "Notebook",
      command: open_command,
      // eslint-disable-next-line max-len
      rank: 1,
    });
  }

  // Add to the file menu.
  if (menu) {
    menu.fileMenu.newMenu.addGroup([{ command: open_command }], 40);
  }

  console.log("JupyterLab extension tiledb-prompt-notebook-options is activated!");
}

export default extension;
