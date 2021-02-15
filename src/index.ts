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


import { requestAPI } from './handler';

import { OrganizationUser, UserApi } from '@tiledb-inc/tiledb-cloud';
import { TileDBPromptOptionsWidget } from "./TileDBPromptOptionsWidget";

const extension: JupyterFrontEndPlugin<void> = {
  activate,
  autoStart: true,
  id: "tiledb-prompt-notebook-options",
  optional: [ILauncher],
  requires: [IMainMenu, IFileBrowserFactory],
};


function getOrgNamesWithWritePermissions(orgs: OrganizationUser[]): string[] {
  const orgNames: string[] = [];

  orgs.forEach(org => {
    const orgName = (org as any).organization_name;
    if (orgName !== 'public' && !!~(org as any).allowed_actions.indexOf('write' as any)) {
      orgNames.push(orgName);
    }
  });

  return orgNames;
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
      const organizationsWithWritePermissions = getOrgNamesWithWritePermissions(userData.organizations || []);
      const defaultS3Path = (userData as any).default_s3_path || 's3://tiledb-user/notebooks';

      owners.push(...organizationsWithWritePermissions);

      showDialog({
        body: new TileDBPromptOptionsWidget({
          owners,
          credentials: credentialsResponse.data || [],
          defaultS3Path
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
