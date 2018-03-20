import ResizeObserver from 'resize-observer-polyfill';
import getQueriesForElement from './getQueriesForElement';

const DEFAULT_QUERY_PREFIX = 'data';

class ElementQueries {
  private _element: Element;
  private _queryPrefix: string;
  private _queries: { mode: string; width: number }[];
  private _observer: ResizeObserver;

  constructor(element, { prefix = DEFAULT_QUERY_PREFIX } = {}) {
    this._element = element;
    this._queryPrefix = prefix;
    this._queries = getQueriesForElement(element, prefix);

    if (this._queries.length) {
      this._observer = new ResizeObserver(([entry]) => {
        this._onResized(entry.contentRect.width);
      });

      this._observer.observe(element);
    }
  }

  private _getQueryAttributeValue(mode, elementWidth) {
    return this._queries
      .filter(query => query.mode === mode && query.width >= elementWidth)
      .map(query => `${query.width}px`)
      .join(' ');
  }

  private _setQueryAttribute(mode, elementWidth) {
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

  private _onResized(width) {
    this._setQueryAttribute('min', width);
    this._setQueryAttribute('max', width);
  }

  destroy() {
    if (this._observer) {
      this._observer.unobserve(this._element);
      this._observer = null;
    }
  }
}

export default ElementQueries;
