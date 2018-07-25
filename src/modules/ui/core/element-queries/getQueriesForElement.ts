import { forEachMatch, reduce } from './utils';
import isElementMatchesSelector from './isElementMatchesSelector';

// NOTE: "inspired" by https://github.com/marcj/css-element-queries/blob/1.0.2/src/ElementQueries.js#L340-L393

const CSS_SELECTOR_PATTERN = /,?[\s\t]*([^,\n]*?)((?:\[[\s\t]*?(?:[a-z-]+-)?(?:min|max)-width[\s\t]*?[~$\^]?=[\s\t]*?"[^"]*?"[\s\t]*?])+)([^,\n\s\{]*)/gim;
const QUERY_ATTR_PATTERN = /\[[\s\t]*?(?:([a-z-]+)-)?(min|max)-width[\s\t]*?[~$\^]?=[\s\t]*?"([^"]*?)"[\s\t]*?]/gim;

function getQueriesFromCssSelector(cssSelector: string) {
  const results: any[] = [];

  if (
    cssSelector.indexOf('min-width') === -1 &&
    cssSelector.indexOf('max-width') === -1
  ) {
    return [];
  }

  cssSelector = cssSelector.replace(/'/g, '"');

  forEachMatch(cssSelector, CSS_SELECTOR_PATTERN, (match: RegExpMatchArray) => {
    const [selectorPart1, attribute, selectorPart2] = match.slice(1);
    const selector = selectorPart1 + selectorPart2;

    forEachMatch(attribute, QUERY_ATTR_PATTERN, (match: RegExpMatchArray) => {
      const [prefix = '', mode, width] = match.slice(1);

      results.push({
        selector,
        prefix,
        mode,
        width: parseInt(width, 10),
      });
    });
  });

  return results;
}

function getQueriesFromRules(rules: CSSRuleList) {
  return reduce(
    rules,
    (results: any[], rule: any) => {
      // https://developer.mozilla.org/en-US/docs/Web/API/CSSRule
      // CSSRule.STYLE_RULE
      if (rule.type === 1) {
        const selector = rule.selectorText || rule.cssText;

        return results.concat(getQueriesFromCssSelector(selector));
      }

      // NOTE: add other `CSSRule` types if required.
      // Example - https://github.com/marcj/css-element-queries/blob/1.0.2/src/ElementQueries.js#L384-L390

      return results;
    },
    [],
  );
}

function getQueries() {
  return reduce(
    document.styleSheets,
    (results: any[], styleSheet: CSSStyleSheet) => {
      // NOTE: browser may not able to read rules for cross-domain stylesheets
      try {
        const rules = styleSheet.cssRules || styleSheet.rules;

        if (rules) {
          return results.concat(getQueriesFromRules(rules));
        }

        if (styleSheet.cssText) {
          return results.concat(getQueriesFromCssSelector(styleSheet.cssText));
        }
      } catch (e) {}

      return results;
    },
    [],
  );
}

function getQueriesForElement(element: HTMLElement, prefix = '') {
  const matchedSelectors = new Map();
  const queries: any[] = [];

  getQueries().forEach((query: any) => {
    if (!matchedSelectors.has(query.selector)) {
      matchedSelectors.set(
        query.selector,
        isElementMatchesSelector(element, query.selector),
      );
    }

    if (!matchedSelectors.get(query.selector)) {
      return;
    }

    if (
      query.prefix === prefix &&
      !queries.some(
        _query => _query.mode === query.mode && _query.width === query.width,
      )
    ) {
      queries.push({
        mode: query.mode,
        width: query.width,
      });
    }
  });

  return queries.sort((a, b) => a.width - b.width);
}

export default getQueriesForElement;
