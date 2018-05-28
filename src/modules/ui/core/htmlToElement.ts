function htmlToElement(html: string) {
  const div: HTMLDivElement = document.createElement('div');
  div.innerHTML = html.trim();
  return div.firstChild as HTMLElement;
}

export default htmlToElement;
