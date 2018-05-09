import getQueriesForElement from './getQueriesForElement';

const DEFAULT_QUERY_PREFIX = 'data';

class ElementQueries {
  private _element: Element;
  private _queryPrefix: string;
  private _queries: { mode: string; width: number }[];

  constructor(element, { prefix = DEFAULT_QUERY_PREFIX } = {}) {
    this._element = element;
    this._queryPrefix = prefix;
    this._queries = getQueriesForElement(element, prefix);
  }

  private _getQueryAttributeValue(mode, elementWidth) {
    return this._queries
      .filter(
        query =>
          query.mode === mode &&
          ((mode === 'max' && query.width >= elementWidth) ||
            (mode === 'min' && query.width <= elementWidth)),
      )
      .map(query => `${query.width}px`)
      .join(' ');
  }

  private _setQueryAttribute(mode: string, elementWidth: number) {
    const attributeName = this._queryPrefix
      ? `${this._queryPrefix}-${mode}-width`
      : `${mode}-width`;
    const attributeValue = this._getQueryAttributeValue(mode, elementWidth);

    if (attributeValue) {
      this._element.setAttribute(attributeName, attributeValue);
    } else {
      this._element.removeAttribute(attributeName);
    }
  }

  setWidth(width: number) {
    this._onResized(width);
  }

  private _onResized(width: number) {
    this._setQueryAttribute('min', width);
    this._setQueryAttribute('max', width);
  }

  destroy() {
    this._element = null;
  }
}

export default ElementQueries;
