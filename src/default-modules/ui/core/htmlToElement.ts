const TEMPLATE = document.createElement('template');

function htmlToElement(html) {
  TEMPLATE.innerHTML = html;
  return TEMPLATE.content.firstChild as HTMLElement;
}

export default htmlToElement;
