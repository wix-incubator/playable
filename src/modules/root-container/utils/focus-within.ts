// inspired by https://gist.github.com/aFarkas/a7e0d85450f323d5e164
const focusWithin = () => {
  const slice = [].slice;
  const removeClass = (elem: any) => {
    elem.classList.remove('focus-within');
  };
  const update = (() => {
    let running: boolean;
    let last: Element;
    const action = () => {
      let element: any = document.activeElement;

      running = false;
      if (last !== element) {
        last = element;
        slice
          .call(document.getElementsByClassName('focus-within'))
          .forEach(removeClass);
        while (element && element.classList) {
          element.classList.add('focus-within');
          element = element.parentNode;
        }
      }
    };

    return () => {
      if (!running) {
        requestAnimationFrame(action);
        running = true;
      }
    };
  })();

  document.addEventListener('focus', update, true);
  document.addEventListener('blur', update, true);
  update();

  return () => {
    document.removeEventListener('focus', update, true);
    document.removeEventListener('blur', update, true);
  };
};

export default focusWithin;
