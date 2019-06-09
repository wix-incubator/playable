function htmlToElement(html: string) {
  if (!html) {
    throw new Error('HTML provided to htmlToElement is empty');
  }

  const div: HTMLDivElement = document.createElement('div');
  div.innerHTML = html.trim();

  if (div.childElementCount > 1) {
    throw new Error("HTML provided to htmlToElement doesn't have root element");
  }

  const firstChild = div.firstChild as HTMLElement;

  firstChild.setAttribute('data-playable-element', '');

  return firstChild;
}

export default htmlToElement;
