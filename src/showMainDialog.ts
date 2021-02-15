import { showDialog } from '@jupyterlab/apputils';
import { Dialog } from '@jupyterlab/apputils';
import { Options, TileDBPromptOptionsWidget } from "./dialogs/TileDBPromptOptionsWidget";

const showMainDialog = (data: Options) => {
    showDialog({
        body: new TileDBPromptOptionsWidget(data),
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: "GO" })],
        title: "TileDB Notebook Options",
      }).then((result : any) => {
        if (result.button.label === "Cancel") {
          return;
        } else if (result.button.label === "GO"){
          var results = result.value.split(" ");
          var tiledb_options_json = 
          {
            name: results[0],
            s3_prefix: results[1],
            s3_credentials: results[2]
          };
          
          return new Promise(() => {
            var path = "cloud/owned/".concat(results[3], "/")
            data.app.commands.execute(
              "docmanager:new-untitled", { 
              path: path,
              type: "notebook",
              options: JSON.stringify(tiledb_options_json)
            }).then((model: any) => {
                data.app.commands.execute(
                  "docmanager:open", {
                  factory: "Notebook", 
                  path: model.path + ".ipynb",
                });
              })
          })
        }
      })
}

export default showMainDialog;