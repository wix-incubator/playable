const TEMPLATE = document.createElement('template');

function htmlToElement(html) {
  TEMPLATE.innerHTML = html.trim();
  return TEMPLATE.content.firstChild as HTMLElement;
}

export default htmlToElement;
