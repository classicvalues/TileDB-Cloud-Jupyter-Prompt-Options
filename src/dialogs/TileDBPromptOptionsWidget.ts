import { JupyterFrontEnd } from '@jupyterlab/application';
import { Widget } from "@lumino/widgets";

import { Dialog, showDialog } from "@jupyterlab/apputils";
import { CredentialsDialog } from "./CredentialsDialog";
import getTileDBAPI from "../tiledbAPI";
import showMainDialog from '../showMainDialog';

export interface Options {
  owners: string[];
    credentials: any[];
    defaultS3Path: string;
    app: JupyterFrontEnd;
}

export class TileDBPromptOptionsWidget extends Widget {
  public constructor(options: Options) {
    const body = document.createElement("div");

    super({ node: body });

    const name_label = document.createElement("label");
    name_label.textContent = "Name:";
    const name_input = document.createElement("input");
    name_input.setAttribute("type", "text");
    name_input.setAttribute("value", "Untitled");

    const s3_label = document.createElement("label");
    s3_label.textContent = "S3 Path:";
    const s3_input = document.createElement("input");
    s3_input.setAttribute("type", "text");
    s3_input.setAttribute("value", options.defaultS3Path);

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

    const addCredentialsLink = document.createElement("a");
    addCredentialsLink.textContent = "Add credentials";
    addCredentialsLink.style.color = "#106ba3";
    addCredentialsLink.style.textDecoration = "underline";
    addCredentialsLink.onclick = () => {
      const username = options.owners[0];
      openCredentialsDialog(username, options);
      const cancelButton: HTMLElement = document.body.querySelector('.jp-Dialog-button.jp-mod-reject');
      cancelButton.click();
    };

    const owner_label = document.createElement("label");
    owner_label.textContent = "Owner:";
    const owner_input = document.createElement("select");

    options.owners.forEach((owner) => {
      const option = document.createElement("option");
      option.setAttribute("value", owner);
      option.setAttribute("label", owner);
      owner_input.append(option);
    });
    owner_input.setAttribute("name", "user");

    body.appendChild(name_label);
    body.appendChild(name_input);
    body.appendChild(s3_label);
    body.appendChild(s3_input);
    body.appendChild(s3_cred_label);
    body.appendChild(s3_cred_input);
    body.appendChild(addCredentialsLink);
    body.appendChild(owner_label);
    body.appendChild(owner_input);
  }

  public getValue(): string {
    let input_elem = this.node.getElementsByTagName("input");
    let select_elem = this.node.getElementsByTagName("select");

    return [
      input_elem[0].value,
      input_elem[1].value,
      select_elem[0].value,
      select_elem[1].value,
    ].join(" ");
  }
}

function openCredentialsDialog(username: string, options: Options) {
  showDialog({
    body: new CredentialsDialog(),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: "Add" })],
    title: "Add AWS credentials",
  }).then(async (result: any) => {
    if (result.button.label === "Cancel") {
      return;
    } else if (result.button.label === "Add") {
      var [credentialName, credentialKey, credentialSecret] = result.value.split(" ");
      const tileDBAPI = await getTileDBAPI();

      await tileDBAPI.addAWSAccessCredentials(username, {
        access_key_id: credentialKey,
        name: credentialName,
        secret_access_key: credentialSecret,
      } as any);
      const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(username);

      showMainDialog({
        ...options,
        credentials: credentialsResponse.data || [],
      });

    }
  });
}
