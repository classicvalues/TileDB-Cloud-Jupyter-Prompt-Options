import { UserApi } from '@tiledb-inc/tiledb-cloud';
import { addOptionsToSelectInput } from './../helpers/dom';
import { JupyterFrontEnd } from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { showErrorMessage } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { openCredentialsDialog } from '../helpers/openDialogs';
import { resetSelectInput } from '../helpers/dom';
import getTileDBAPI from '../helpers/tiledbAPI';
import getDefaultS3DataFromNamespace from '../helpers/getDefaultS3DataFromNamespace';

export interface Options {
  owners: string[];
  credentials: any[];
  defaultS3Path: string;
  defaultS3CredentialName?: string;
  app: JupyterFrontEnd;
  docManager: IDocumentManager;
  selectedOwner: string;
}

export interface PromptDialogValue {
  name: string;
  s3_prefix: string;
  s3_credentials: string;
  owner: string;
  kernel: string;
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
    name_input.setAttribute('required', 'true');
    name_input.setAttribute('pattern', '([A-Z]|[a-z]|[0-9]|_|-)+');
    name_input.setAttribute('oninput', 'this.setCustomValidity("")');
    name_input.oninvalid = (): void => {
      if (!name_input.value) {
        name_input.setCustomValidity('This field is required');
      } else {
        name_input.setCustomValidity(
          'Name should consist of letters(a -z and A-Z), numbers, "_" and "-" only'
        );
      }
    };

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
      openCredentialsDialog(options);
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
      // Get credentials and default credentials name from API
      const userTileDBAPI = await getTileDBAPI(UserApi);
      const credentialsResponse = await userTileDBAPI.checkAWSAccessCredentials(
        newOwner
      );
      const newCredentials = credentialsResponse.data;
      const username = options.owners[0];
      const {
        default_s3_path_credentials_name: defaultCredentialsName,
        default_s3_path: defaultS3Path,
      } = await getDefaultS3DataFromNamespace(username, newOwner);
      // Update the s3_path with the new owner's default_s3_path.
      if (defaultS3Path) {
        s3_input.setAttribute('value', defaultS3Path);
      }
      const credentials: string[] = newCredentials.map((cred) => cred.name);
      addOptionsToSelectInput(
        s3_cred_selectinput,
        credentials,
        defaultCredentialsName
      );
    };

    const kernel_label = document.createElement('label');
    kernel_label.textContent = 'Kernel:';
    const kernel_input = document.createElement('select');
    kernel_input.setAttribute('name', 'kernel');
    const kernelSpecs = this.docManager.services.kernelspecs.specs;
    const listOfAvailableKernels = Object.keys(kernelSpecs.kernelspecs);
    const kernelNames = Object.values(kernelSpecs.kernelspecs).map(
      (kernel) => kernel.display_name
    );
    const defaultKernel = kernelSpecs.default;
    addOptionsToSelectInput(
      kernel_input,
      listOfAvailableKernels,
      defaultKernel,
      kernelNames
    );

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
    form.appendChild(kernel_label);
    form.appendChild(kernel_input);
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
      kernel: select_elem[2].value,
    };
  }
}

function onSbumit(app: JupyterFrontEnd, docManager: IDocumentManager): void {
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

  const {
    name,
    owner,
    s3_credentials,
    s3_prefix,
    kernel: kernelName,
  } = serializeForm(formData);
  const tiledb_options_json = {
    name,
    s3_prefix,
    s3_credentials,
  };

  const kernel = { name: kernelName };

  const path = 'cloud/owned/'.concat(owner, '/');
  const options: any = {
    path: path,
    type: 'notebook',
    options: JSON.stringify(tiledb_options_json),
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
  kernel: string;
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
