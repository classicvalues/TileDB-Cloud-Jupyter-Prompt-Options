import { addOptionsToSelectInput } from './../helpers/dom';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { showErrorMessage } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { openCredentialsDialog } from '../helpers/openDialogs';
import { resetSelectInput } from '../helpers/dom';
import getTileDBAPI from '../helpers/tiledbAPI';

export interface Options {
  owners: string[];
  credentials: any[];
  defaultS3Path: string;
  defaultS3CredentialName: string;
  app: JupyterFrontEnd;
  docManager: IDocumentManager;
  selectedOwner: string;
}

export interface PromptDialogValue {
  name: string;
  s3_prefix: string;
  s3_credentials: string;
  owner: string;
}

export class TileDBPromptOptionsWidget extends Widget {
  private app: JupyterFrontEnd;
  private docManager: IDocumentManager;

  public constructor(options: Options) {
    const body = document.createElement('div');

    super({ node: body });

    this.addClass('TDB-Prompt-Dialog');
    this.app = options.app;
    this.docManager = options.docManager;

    const name_label = document.createElement('label');
    name_label.textContent = 'Name:';
    const name_input = document.createElement('input');
    name_input.setAttribute('type', 'text');
    name_input.setAttribute('value', 'Untitled');
    name_input.setAttribute('name', 'name');

    const s3_label = document.createElement('label');
    s3_label.textContent = 'S3 Path:';
    const s3_input = document.createElement('input');
    s3_input.setAttribute('type', 'text');
    s3_input.setAttribute('value', options.defaultS3Path);
    s3_input.setAttribute('name', 's3_prefix');

    const s3_cred_label = document.createElement('label');
    s3_cred_label.textContent = 'S3 Path Credentials:';
    const s3_cred_selectinput = document.createElement('select');
    s3_cred_selectinput.setAttribute('name', 's3_credentials');
    s3_cred_selectinput.setAttribute('required', 'true');

    const credentials: string[] = options.credentials.map((cred) => cred.name);
    addOptionsToSelectInput(
      s3_cred_selectinput,
      credentials,
      options.defaultS3CredentialName
    );

    const addCredentialsLink = document.createElement('a');
    addCredentialsLink.textContent = 'Add credentials';
    addCredentialsLink.classList.add('TDB-Prompt-Dialog__link');

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

    addOptionsToSelectInput(owner_input, options.owners, options.selectedOwner);

    owner_input.setAttribute('name', 'owner');

    owner_input.onchange = async (e): Promise<any> => {
      const newOwner = (e.currentTarget as HTMLSelectElement).value;
      // Reset credentials input
      resetSelectInput(s3_cred_selectinput);
      const tileDBAPI = await getTileDBAPI();
      const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(
        newOwner
      );
      const newCredentials = credentialsResponse.data;
      const credentials: string[] = newCredentials.map((cred) => cred.name);
      addOptionsToSelectInput(
        s3_cred_selectinput,
        credentials,
        options.defaultS3CredentialName
      );
    };

    const form = document.createElement('form');
    form.classList.add('TDB-Prompt-Dialog__form');

    body.appendChild(form);
    form.appendChild(name_label);
    form.appendChild(name_input);
    form.appendChild(s3_label);
    form.appendChild(s3_input);
    form.appendChild(s3_cred_label);
    form.appendChild(s3_cred_selectinput);
    form.appendChild(addCredentialsLink);
    form.appendChild(owner_label);
    form.appendChild(owner_input);
  }

  /**
   * Add a fake button with a loader to indicate users to wait
   */
  onAfterAttach(): void {
    const footerElement = document.querySelector('.TDB-Prompt-Dialog')
      ?.nextElementSibling;
    const fakeBtn = document.createElement('button');
    fakeBtn.classList.add(
      'TDB-Prompt-Dialog__styled-btn',
      'jp-Dialog-button',
      'jp-mod-accept',
      'jp-mod-styled'
    );
    fakeBtn.textContent = 'GO';
    fakeBtn.onclick = (): void => onSbumit(this.app, this.docManager);
    footerElement.appendChild(fakeBtn);
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

function onSbumit(app: JupyterFrontEnd, docManager: IDocumentManager): void {
  const kernel = { name: 'python3' };
  const fakeBtn = document.querySelector(
    '.TDB-Prompt-Dialog__styled-btn'
  ) as HTMLButtonElement;
  const originalSubmitButton = document.querySelector(
    '.TDB-Prompt-Dialog__btn'
  ) as HTMLButtonElement;
  const formElement = document.querySelector(
    '.TDB-Prompt-Dialog__form'
  ) as HTMLFormElement;
  const formData = new FormData(formElement);

  // If form is not valid just return
  if (!formElement.reportValidity()) {
    return;
  }

  fakeBtn.textContent = '';

  const loader = document.createElement('div');
  loader.classList.add('TDB-Prompt-Dialog__loader');
  fakeBtn.appendChild(loader);

  const { name, owner, s3_credentials, s3_prefix } = serializeForm(formData);
  const tiledb_options_json = {
    name,
    s3_prefix,
    s3_credentials,
  };

  const path = 'cloud/owned/'.concat(owner, '/');

  const options: any = {
    path: path,
    type: 'notebook',
    options: JSON.stringify(tiledb_options_json) as any,
  };

  docManager.services.contents
    .newUntitled(options)
    .then((model) => {
      app.commands
        .execute('docmanager:open', {
          factory: 'Notebook',
          path: model.path + '.ipynb',
          kernel,
        })
        .finally(() => {
          // We click the original submit button to close the dialog
          originalSubmitButton.click();
        });
    })
    .catch((err) => {
      showErrorMessage('Error', err);
      originalSubmitButton.click();
    });
}

interface FormValues {
  name: string;
  owner: string;
  s3_credentials: string;
  s3_prefix: string;
}

function serializeForm(formData: FormData): FormValues {
  const obj: any = {};
  for (const key of formData.keys()) {
    obj[key] = formData.get(key);
  }
  return obj;
}
