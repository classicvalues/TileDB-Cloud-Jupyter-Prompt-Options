import { UserApi } from '@tiledb-inc/tiledb-cloud';
import { showDialog, showErrorMessage } from '@jupyterlab/apputils';
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
import getDefaultCredentialNameFromNamespace from './getDefaultCredentialNameFromNamespace';

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

export function openCredentialsDialog(options: Options): void {
  showDialog<CredentialsDialogValue>({
    body: new CredentialsDialog(options.owners),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Add' })],
    title: 'Add AWS credentials',
  }).then(async (result) => {
    if (result.button.label === 'Cancel') {
      return;
    } else if (result.button.label === 'Add') {
      const {
        credentialName,
        credentialKey,
        credentialSecret,
        owner,
      } = result.value;
      const tileDBAPI = await getTileDBAPI(UserApi);
      try {
        await tileDBAPI.addAWSAccessCredentials(owner, {
          access_key_id: credentialKey,
          name: credentialName,
          secret_access_key: credentialSecret,
        });
        const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(
          owner
        );
        const user = options.owners[0];
        const defaultS3CredentialName = await getDefaultCredentialNameFromNamespace(
          user,
          owner
        );

        showMainDialog({
          ...options,
          credentials: credentialsResponse.data || [],
          selectedOwner: owner,
          defaultS3CredentialName,
        });
      } catch (err) {
        showErrorMessage('Error registering credentials', err);
      }
    }
  });
}
