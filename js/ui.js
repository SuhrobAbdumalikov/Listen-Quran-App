//=========>> option <<=============================//
export function createOption({value,textContent}) {
    const option = document.createElement('option');
    option.value = value;
    option.textContent = textContent;
    return option
}