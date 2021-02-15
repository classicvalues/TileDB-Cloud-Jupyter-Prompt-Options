import {
    Widget,
  } from "@lumino/widgets";

export
class CredentialsDialog extends Widget {

  public constructor() {
    const body = document.createElement("div");

    const name_label = document.createElement("label");
    name_label.textContent = "Name:";
    const name_input = document.createElement("input");
    name_input.setAttribute("type", "text");
    name_input.setAttribute("value", "");

    const key_label = document.createElement("label");
    key_label.textContent = "AWS access key id:";
    const key_input = document.createElement("input");
    key_input.setAttribute("type", "text");
    key_input.setAttribute("value", "");

    const secret_label = document.createElement("label");
    secret_label.textContent = "AWS secret access key:";
    const secret_input = document.createElement("input");
    secret_input.setAttribute("type", "text");
    secret_input.setAttribute("value", "");


    body.appendChild(name_label);
    body.appendChild(name_input);
    body.appendChild(key_label);
    body.appendChild(key_input);
    body.appendChild(secret_label);
    body.appendChild(secret_input);

    super({ node: body });
  }

  public getValue(): string {
    let input_elem = this.node.getElementsByTagName("input");

    return [input_elem[0].value, input_elem[1].value,  input_elem[2].value].join(" ");
  }
}
