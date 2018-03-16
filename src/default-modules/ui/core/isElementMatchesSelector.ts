const ALIASES = [
  'matches',
  'webkitMatchesSelector',
  'mozMatchesSelector',
  'msMatchesSelector',
];

let matchesSelectorFn;

for (let i = 0; i < ALIASES.length; i++) {
  matchesSelectorFn = Element.prototype[ALIASES[i]];

  if (matchesSelectorFn) {
    break;
  }
}

const isElementMatchesSelector = matchesSelectorFn
  ? (element, selector) => matchesSelectorFn.call(element, selector)
  : (element, selector) =>
      Array.prototype.indexOf.call(
        document.querySelectorAll(selector),
        element,
      ) !== -1;

export default isElementMatchesSelector;
