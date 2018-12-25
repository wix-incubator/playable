import { ITopButtons } from './types';

import View from './top-buttons.view';

//tslint:disable-next-line
const _noop = () => {};

export default class TopButtons implements ITopButtons {
  static moduleName = 'topButtons';
  static View = View;

  isHidden: boolean;
  view: View;

  private _buyCallback: () => void;
  private _infoCallback: () => void;
  private _shareCallback: () => void;
  private _commentsCallback: () => void;
  private _cardsCallback: () => void;

  constructor() {
    this.isHidden = false;

    this._bindCallback();
    this._initUI();
  }

  private _bindCallback() {
    this._broadcastBuyClick = this._broadcastBuyClick.bind(this);
    this._broadcastInfoClick = this._broadcastInfoClick.bind(this);
    this._broadcastShareClick = this._broadcastShareClick.bind(this);
    this._broadcastCommentsClick = this._broadcastCommentsClick.bind(this);
    this._broadcastCardsClick = this._broadcastCardsClick.bind(this);
  }

  private _initUI() {
    this.view = new TopButtons.View();
  }

  private _broadcastBuyClick() {
    this._buyCallback();
  }

  private _broadcastInfoClick() {
    this._infoCallback();
  }

  private _broadcastShareClick() {
    this._shareCallback();
  }

  private _broadcastCommentsClick() {
    this._commentsCallback();
  }

  private _broadcastCardsClick() {
    this._cardsCallback();
  }

  setCallbacks(callbacks: {
    cards: () => void;
    info: () => void;
    share: () => void;
    comments: () => void;
    buy: () => void;
  }) {
    const {
      cards = _noop,
      info = _noop,
      share = _noop,
      comments = _noop,
      buy = _noop,
    } = callbacks;

    this._buyCallback = buy;
    this._cardsCallback = cards;
    this._infoCallback = info;
    this._shareCallback = share;
    this._commentsCallback = comments;
  }

  getElement() {
    return this.view.getElement();
  }

  destroy() {
    this.view.destroy();
    this.view = null;
  }
}
