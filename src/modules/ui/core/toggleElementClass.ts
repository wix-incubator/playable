function toggleElementClass(
  element: HTMLElement,
  className: string,
  shouldAdd: boolean,
) {
  if (shouldAdd) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

export default toggleElementClass;
