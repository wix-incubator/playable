// Unspecified error on Internet Explorer with document.activeElement
// https://github.com/reactjs/react-tabs/issues/193
const canUseActiveElement =
  typeof window !== 'undefined' &&
  window.document &&
  (typeof window.document.activeElement as any) !== 'unknown';

// inspired by https://gist.github.com/aFarkas/a7e0d85450f323d5e164
const FOCUS_WITHIN_CLASSNAME = 'focus-within';

const clearFocusWithinClass = (element: Element): void => {
  Array.prototype.slice
    .call(element.getElementsByClassName(FOCUS_WITHIN_CLASSNAME))
    .forEach((elem: Element) => {
      elem.classList.remove(FOCUS_WITHIN_CLASSNAME);
    });
};

function isElementNode(node: Node): node is Element {
  return typeof (node as Element).classList !== 'undefined';
}

const addFocusWithinClass = (
  boundaryElement: Element,
  activeElement: Element,
): void => {
  let currentNode: Node = activeElement;
  while (currentNode !== boundaryElement && isElementNode(currentNode)) {
    currentNode.classList.add(FOCUS_WITHIN_CLASSNAME);
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
      const activeElement = canUseActiveElement ? document.activeElement : null;
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
