import { showDialog } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';
import {
  CredentialsDialog,
  CredentialsDialogValue,
} from '../dialogs/CredentialsDialog';
import {
  Options,
  PromptDialogValue,
  TileDBPromptOptionsWidget,
} from '../dialogs/TileDBPromptOptionsWidget';
import getTileDBAPI from './tiledbAPI';

export const showMainDialog = (data: Options): void => {
  showDialog<PromptDialogValue>({
    body: new TileDBPromptOptionsWidget(data),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'GO', className: 'TDB-Prompt-Dialog__btn' }),
    ],
    title: 'TileDB Notebook Options',
  });
};

export function openCredentialsDialog(
  username: string,
  options: Options
): void {
  showDialog<CredentialsDialogValue>({
    body: new CredentialsDialog(),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Add' })],
    title: 'Add AWS credentials',
  }).then(async (result) => {
    if (result.button.label === 'Cancel') {
      return;
    } else if (result.button.label === 'Add') {
      const { credentialName, credentialKey, credentialSecret } = result.value;
      const tileDBAPI = await getTileDBAPI();

      await tileDBAPI.addAWSAccessCredentials(username, {
        access_key_id: credentialKey,
        name: credentialName,
        secret_access_key: credentialSecret,
      } as any);
      const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(
        username
      );

      showMainDialog({
        ...options,
        credentials: credentialsResponse.data || [],
      });
    }
  });
}
