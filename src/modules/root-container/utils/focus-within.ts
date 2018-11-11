// inspired by https://gist.github.com/aFarkas/a7e0d85450f323d5e164
const FOCUS_WITHIN_CLASSNAME = 'focus-within';

const clearFocusWithinClass = (element: Element): void => {
  Array.prototype.slice
    .call(element.getElementsByClassName(FOCUS_WITHIN_CLASSNAME))
    .forEach((elem: Element) => {
      elem.classList.remove(FOCUS_WITHIN_CLASSNAME);
    });
};

const addFocusWithinClass = (
  boundaryElement: Element,
  activeElement: Element,
): void => {
  let currentNode: Node = activeElement;
  while (currentNode !== boundaryElement && (<Element>currentNode).classList) {
    (<Element>currentNode).classList.add(FOCUS_WITHIN_CLASSNAME);
    currentNode = currentNode.parentNode;
  }
};

const focusWithin = (
  rootElement: Element,
  onFocusEnter: () => void,
  onFocusLeave: () => void,
): (() => void) => {
  const update = (() => {
    let running: boolean;
    let last: Element;
    let isFocused: boolean;

    const action = () => {
      const activeElement: any = document.activeElement;
      running = false;

      if (last !== activeElement) {
        last = activeElement;

        clearFocusWithinClass(rootElement);

        if (!rootElement.contains(activeElement)) {
          if (isFocused) {
            isFocused = false;
            onFocusLeave();
          }

          return;
        }

        if (!isFocused) {
          isFocused = true;
          onFocusEnter();
        }

        addFocusWithinClass(rootElement, activeElement);
      }
    };

    return () => {
      if (!running) {
        requestAnimationFrame(action);
        running = true;
      }
    };
  })();

  rootElement.addEventListener('focus', update, true);
  rootElement.addEventListener('blur', update, true);
  update();

  return (): void => {
    rootElement.removeEventListener('focus', update, true);
    rootElement.removeEventListener('blur', update, true);
  };
};

export default focusWithin;
