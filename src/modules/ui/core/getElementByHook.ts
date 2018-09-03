function getElementByHook(element: HTMLElement, hook: string): HTMLElement {
  return element.querySelector(`[data-playable-hook="${hook}"]`);
}

export default getElementByHook;
