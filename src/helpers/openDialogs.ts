import { showDialog } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';
import {
  IOptions,
  IPromptDialogValue,
  TileDBPromptOptionsWidget
} from '../dialogs/TileDBPromptOptionsWidget';

export const showMainDialog = (data: IOptions): void => {
  showDialog<IPromptDialogValue>({
    body: new TileDBPromptOptionsWidget(data),
    buttons: [
      Dialog.cancelButton(),
      Dialog.okButton({ label: 'GO', className: 'TDB-Prompt-Dialog__btn' })
    ],
    title: 'TileDB Notebook Options'
  });
};
