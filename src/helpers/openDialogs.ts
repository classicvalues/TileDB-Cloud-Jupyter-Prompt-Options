import { showDialog } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';
import {
  Options,
  PromptDialogValue,
  TileDBPromptOptionsWidget,
} from '../dialogs/TileDBPromptOptionsWidget';

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
