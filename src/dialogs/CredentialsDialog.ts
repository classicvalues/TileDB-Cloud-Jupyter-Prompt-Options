import { Widget } from '@lumino/widgets';
import { addOptionsToSelectInput } from '../helpers/dom';

export interface CredentialsDialogValue {
  credentialName: string;
  credentialKey: string;
  credentialSecret: string;
  owner: string;
}

export class CredentialsDialog extends Widget {
  public constructor(owners: string[]) {
    const body = document.createElement('div');

    super({ node: body });

    this.addClass('TDB-Credentials-Dialog');

    const nameLabel = document.createElement('label');
    nameLabel.textContent = 'Name:';
    const nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('value', '');

    const keyLabel = document.createElement('label');
    keyLabel.textContent = 'AWS access key id:';
    const keyInput = document.createElement('input');
    keyInput.setAttribute('type', 'text');
    keyInput.setAttribute('value', '');

    const secretLabel = document.createElement('label');
    secretLabel.textContent = 'AWS secret access key:';
    const secretInput = document.createElement('input');
    secretInput.setAttribute('type', 'text');
    secretInput.setAttribute('value', '');

    const ownerLabel = document.createElement('label');
    ownerLabel.textContent = 'Credential namespace:';
    const ownerInput = document.createElement('select');

    addOptionsToSelectInput(ownerInput, owners);

    ownerInput.setAttribute('name', 'owner');

    body.appendChild(nameLabel);
    body.appendChild(nameInput);
    body.appendChild(keyLabel);
    body.appendChild(keyInput);
    body.appendChild(secretLabel);
    body.appendChild(secretInput);
    body.appendChild(ownerLabel);
    body.appendChild(ownerInput);
  }

  public getValue(): CredentialsDialogValue {
    const [
      credentialNameInput,
      credentialKeyInput,
      credentialSecretInput,
    ] = this.node.getElementsByTagName('input');
    const ownerSelectInput = this.node.querySelector('select');

    return {
      credentialName: credentialNameInput.value,
      credentialKey: credentialKeyInput.value,
      credentialSecret: credentialSecretInput.value,
      owner: ownerSelectInput.value,
    };
  }
}
