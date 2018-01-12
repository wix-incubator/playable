function getElementByHook(element: HTMLElement, hook: string): HTMLElement {
  return element.querySelector(`[data-hook="${hook}"]`);
}

export default getElementByHook;
