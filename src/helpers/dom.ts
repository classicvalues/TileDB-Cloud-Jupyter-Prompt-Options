export const resetSelectInput = (selectInput: HTMLSelectElement): void => {
  selectInput.value = '';
  selectInput.innerHTML = '';
};

export const addOptionsToSelectInput = (
  selectInput: HTMLSelectElement,
  options: string[],
  defaultValue?: string
): void => {
  options.forEach((opt) => {
    const option = document.createElement('option');
    option.setAttribute('value', opt);
    option.setAttribute('label', opt);
    if (!!defaultValue && defaultValue === opt) {
      option.setAttribute('selected', 'true');
    }
    selectInput.append(option);
  });
};
