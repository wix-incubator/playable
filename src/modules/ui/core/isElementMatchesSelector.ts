const ALIASES = [
  'matches',
  'webkitMatchesSelector',
  'mozMatchesSelector',
  'msMatchesSelector',
];

let matchesSelectorFn: Function;

if (typeof HTMLElement !== 'undefined') {
  for (let i = 0; i < ALIASES.length; i++) {
    matchesSelectorFn = (Element as any).prototype[ALIASES[i]] as Function;

    if (matchesSelectorFn) {
      break;
    }
  }
}

const isElementMatchesSelector = matchesSelectorFn
  ? (element: HTMLElement, selector: string) =>
      matchesSelectorFn.call(element, selector)
  : (element: HTMLElement, selector: string) =>
      Array.prototype.indexOf.call(
        document.querySelectorAll(selector),
        element,
      ) !== -1;

export default isElementMatchesSelector;
