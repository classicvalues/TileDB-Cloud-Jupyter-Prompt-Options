import { showDialog } from "@jupyterlab/apputils";
import { Dialog } from "@jupyterlab/apputils";
import {
  CredentialsDialog,
  CredentialsDialogValue,
} from "../dialogs/CredentialsDialog";
import {
  Options,
  PromptDialogValue,
  TileDBPromptOptionsWidget,
} from "../dialogs/TileDBPromptOptionsWidget";
import getTileDBAPI from "../tiledbAPI";

export const showMainDialog = (data: Options) => {
  showDialog<PromptDialogValue>({
    body: new TileDBPromptOptionsWidget(data),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: "GO" })],
    title: "TileDB Notebook Options",
  }).then((result) => {
    if (result.button.label === "Cancel") {
      return;
    } else if (result.button.label === "GO") {
      const { name, owner, s3_credentials, s3_prefix } = result.value;
      const tiledb_options_json = {
        name,
        s3_prefix,
        s3_credentials,
      };

      return new Promise(() => {
        const path = "cloud/owned/".concat(owner, "/");
        data.app.commands
          .execute("docmanager:new-untitled", {
            path: path,
            type: "notebook",
            options: JSON.stringify(tiledb_options_json),
          })
          .then((model: any) => {
            data.app.commands.execute("docmanager:open", {
              factory: "Notebook",
              path: model.path + ".ipynb",
            });
          });
      });
    }
  });
};

export function openCredentialsDialog(username: string, options: Options) {
  showDialog<CredentialsDialogValue>({
    body: new CredentialsDialog(),
    buttons: [Dialog.cancelButton(), Dialog.okButton({ label: "Add" })],
    title: "Add AWS credentials",
  }).then(async (result) => {
    if (result.button.label === "Cancel") {
      return;
    } else if (result.button.label === "Add") {
      var { credentialName, credentialKey, credentialSecret } = result.value;
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
