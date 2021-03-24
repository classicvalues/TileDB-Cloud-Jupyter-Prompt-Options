import { UserApi } from '@tiledb-inc/tiledb-cloud';
import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { IDocumentManager } from '@jupyterlab/docmanager';
import { IFileBrowserFactory } from '@jupyterlab/filebrowser';
import { ILauncher } from '@jupyterlab/launcher';
import { IMainMenu } from '@jupyterlab/mainmenu';
import getTileDBAPI from './helpers/tiledbAPI';
import { showMainDialog } from './helpers/openDialogs';
import getOrgNamesWithWritePermissions from './helpers/getOrgNamesWithWritePermissions';

const extension: JupyterFrontEndPlugin<void> = {
  activate,
  autoStart: true,
  id: 'tiledb-prompt-notebook-options',
  optional: [ILauncher],
  requires: [IMainMenu, IDocumentManager, IFileBrowserFactory],
};

function activate(
  app: JupyterFrontEnd,
  menu: IMainMenu,
  docManager: IDocumentManager,
  browser: IFileBrowserFactory,
  launcher: ILauncher | null
): void {
  const OPEN_COMMAND = 'tiledb-prompt-notebook-options:open';

  app.commands.addCommand(OPEN_COMMAND, {
    caption: 'Prompt the user for TileDB notebook options',
    execute: async () => {
      const tileDBAPI = await getTileDBAPI(UserApi);

      const userResponse = await tileDBAPI.getUser();
      const userData = userResponse.data;
      const username = userData.username;
      const credentialsResponse = await tileDBAPI.checkAWSAccessCredentials(
        username
      );
      const owners = [username];
      const organizationsWithWritePermissions = getOrgNamesWithWritePermissions(
        userData.organizations || []
      );
      const defaultS3Path =
        userData.default_s3_path || 's3://tiledb-user/notebooks';

      owners.push(...organizationsWithWritePermissions);

      showMainDialog({
        owners,
        credentials: credentialsResponse.data || [],
        defaultS3Path,
        defaultS3CredentialName: userData.default_s3_path_credentials_name,
        app,
        docManager,
        selectedOwner: userData.username,
      });
    },
    isEnabled: () => true,
    label: 'TileDB Notebook',
  });

  // Add a launcher item.
  if (launcher) {
    launcher.add({
      args: { isLauncher: true, kernelName: 'tiledb-prompt-notebook-options' },
      category: 'Notebook',
      command: OPEN_COMMAND,
      kernelIconUrl:
        'https://cloud.tiledb.com/static/img/tiledb-logo-jupyterlab.svg',
      rank: 1,
    });
  }

  // Add to the file menu.
  if (menu) {
    menu.fileMenu.newMenu.addGroup([{ command: OPEN_COMMAND }], 40);
  }

  console.log(
    'JupyterLab extension @tiledb/tiledb_prompt_options is activated.'
  );
}

export default extension;
