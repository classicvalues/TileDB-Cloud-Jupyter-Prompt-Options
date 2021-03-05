import { Widget } from '@lumino/widgets';

export interface CredentialsDialogValue {
  credentialName: string;
  credentialKey: string;
  credentialSecret: string;
}

export class CredentialsDialog extends Widget {
  public constructor() {
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

    body.appendChild(nameLabel);
    body.appendChild(nameInput);
    body.appendChild(keyLabel);
    body.appendChild(keyInput);
    body.appendChild(secretLabel);
    body.appendChild(secretInput);
  }

  public getValue(): CredentialsDialogValue {
    const [
      credentialNameInput,
      credentialKeyInput,
      credentialSecretInput,
    ] = this.node.getElementsByTagName('input');

    return {
      credentialName: credentialNameInput.value,
      credentialKey: credentialKeyInput.value,
      credentialSecret: credentialSecretInput.value,
    };
  }
}
