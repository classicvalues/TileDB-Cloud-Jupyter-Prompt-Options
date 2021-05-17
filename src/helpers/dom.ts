export const resetSelectInput = (selectInput: HTMLSelectElement): void => {
  selectInput.value = '';
  selectInput.innerHTML = '';
};

export const addOptionsToSelectInput = (
  selectInput: HTMLSelectElement,
  options: string[],
  defaultValue?: string,
  deplayNames?: string[]
): void => {
  options.forEach((opt, i) => {
    const diplayName = deplayNames ? deplayNames[i] : opt;
    const option = document.createElement('option');
    option.setAttribute('value', opt);
    option.setAttribute('label', diplayName);
    if (!!defaultValue && defaultValue === opt) {
      option.setAttribute('selected', 'true');
    }
    selectInput.append(option);
  });
};
