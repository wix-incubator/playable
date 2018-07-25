function htmlToElement(html: string) {
  if (!html) {
    throw new Error('HTML provided to htmlToElement is empty');
  }

  const div: HTMLDivElement = document.createElement('div');
  div.innerHTML = html.trim();

  if (div.childElementCount > 1) {
    throw new Error("HTML provided to htmlToElement doesn't have root element");
  }

  return div.firstChild as HTMLElement;
}

export default htmlToElement;
