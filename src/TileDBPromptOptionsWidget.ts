import {
    Widget,
  } from "@lumino/widgets";

export
class TileDBPromptOptionsWidget extends Widget {

  public constructor(options: {owners: string[], credentials: any[], defaultS3Path: string}) {
    const body = document.createElement("div");

    const name_label = document.createElement("label");
    name_label.textContent = "Name:";
    const name_input = document.createElement("input");
    name_input.setAttribute("type", "text");
    name_input.setAttribute("value", "Untitled");

    const s3_label = document.createElement("label");
    s3_label.textContent = "S3 Path:";
    const s3_input = document.createElement("input");
    s3_input.setAttribute("type", "text");
    s3_input.setAttribute("value", options.defaultS3Path);

    const s3_cred_label = document.createElement("label");
    s3_cred_label.textContent = "S3 Path Credentials:";
    const s3_cred_input = document.createElement("select");
    s3_cred_input.setAttribute("name", "tiledb-user-creds");
    options.credentials.forEach((cred) => {
      const option = document.createElement("option");
      option.setAttribute("value", cred.name);
      option.setAttribute("label", cred.name);
      s3_cred_input.append(option);
    });
    
    const owner_label = document.createElement("label");
    owner_label.textContent = "Owner:";
    const owner_input = document.createElement("select");

    options.owners.forEach((owner) => {
      const option = document.createElement("option");
      option.setAttribute("value", owner);
      option.setAttribute("label", owner);
      owner_input.append(option);
    })
    owner_input.setAttribute("name", "user");

    body.appendChild(name_label);
    body.appendChild(name_input);
    body.appendChild(s3_label);
    body.appendChild(s3_input);
    body.appendChild(s3_cred_label);
    body.appendChild(s3_cred_input);
    body.appendChild(owner_label);
    body.appendChild(owner_input);

    super({ node: body });
  }

  public getValue(): string {
    let input_elem = this.node.getElementsByTagName("input");
    let select_elem = this.node.getElementsByTagName("select");

    return [input_elem[0].value, input_elem[1].value, 
    select_elem[0].value, select_elem[1].value].join(" ");
  }
}
