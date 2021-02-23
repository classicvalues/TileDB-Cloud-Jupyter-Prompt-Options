import { JupyterFrontEnd } from '@jupyterlab/application';
import { Widget } from '@lumino/widgets';
import { openCredentialsDialog } from '../helpers/openDialogs';

export interface Options {
  owners: string[];
  credentials: any[];
  defaultS3Path: string;
  defaultS3CredentialName: string;
  app: JupyterFrontEnd;
}

export interface PromptDialogValue {
  name: string;
  s3_prefix: string;
  s3_credentials: string;
  owner: string;
}

export class TileDBPromptOptionsWidget extends Widget {
  public constructor(options: Options) {
    const body = document.createElement('div');

    super({ node: body });

    const name_label = document.createElement('label');
    name_label.textContent = 'Name:';
    const name_input = document.createElement('input');
    name_input.setAttribute('type', 'text');
    name_input.setAttribute('value', 'Untitled');

    const s3_label = document.createElement('label');
    s3_label.textContent = 'S3 Path:';
    const s3_input = document.createElement('input');
    s3_input.setAttribute('type', 'text');
    s3_input.setAttribute('value', options.defaultS3Path);

    const s3_cred_label = document.createElement('label');
    s3_cred_label.textContent = 'S3 Path Credentials:';
    const s3_cred_input = document.createElement('select');
    s3_cred_input.setAttribute('name', 'tiledb-user-creds');

    options.credentials.forEach((cred) => {
      const option = document.createElement('option');
      option.setAttribute('value', cred.name);
      option.setAttribute('label', cred.name);
      if (options.defaultS3CredentialName === cred.name) {
        option.setAttribute('selected', 'true');
      }
      s3_cred_input.append(option);
    });

    const addCredentialsLink = document.createElement('a');
    addCredentialsLink.textContent = 'Add credentials';
    addCredentialsLink.style.color = '#106ba3';
    addCredentialsLink.style.textDecoration = 'underline';
    addCredentialsLink.onclick = (): void => {
      const username = options.owners[0];
      openCredentialsDialog(username, options);
      const cancelButton: HTMLElement = document.body.querySelector(
        '.jp-Dialog-button.jp-mod-reject'
      );
      cancelButton.click();
    };

    const owner_label = document.createElement('label');
    owner_label.textContent = 'Owner:';
    const owner_input = document.createElement('select');

    options.owners.forEach((owner) => {
      const option = document.createElement('option');
      option.setAttribute('value', owner);
      option.setAttribute('label', owner);
      owner_input.append(option);
    });
    owner_input.setAttribute('name', 'user');

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

  public getValue(): PromptDialogValue {
    const input_elem = this.node.getElementsByTagName('input');
    const select_elem = this.node.getElementsByTagName('select');

    return {
      name: input_elem[0].value,
      s3_prefix: input_elem[1].value,
      s3_credentials: select_elem[0].value,
      owner: select_elem[1].value,
    };
  }
}
