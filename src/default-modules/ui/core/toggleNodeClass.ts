function toggleNodeClass(
  node: HTMLElement,
  className: string,
  shouldAdd: boolean,
) {
  if (shouldAdd) {
    node.classList.add(className);
  } else {
    node.classList.remove(className);
  }
}

export default toggleNodeClass;
