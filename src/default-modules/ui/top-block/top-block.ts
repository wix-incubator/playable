import * as get from 'lodash/get';

import { UI_EVENTS } from '../../../constants/index';

import View from './top-block.view';

export default class TopBlock {
  static View = View;
  static dependencies = [
    'config',
    'rootContainer',
    'eventEmitter',
    'screen',
    'title',
    'liveIndicator',
  ];

  private _eventEmitter;
  private _screen;

  isHidden: boolean;
  view: View;

  constructor(dependencies) {
    const { config, eventEmitter, screen, rootContainer } = dependencies;

    this._eventEmitter = eventEmitter;
    this._screen = screen;
    this.isHidden = false;

    this._bindEvents();
    this._initUI(this._getElementNodes(dependencies));

    rootContainer.appendComponentNode(this.node);

    if (get(config, 'ui.controls') === false) {
      this.hide();
    }
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this._hideContent,
      this,
    );
    this._eventEmitter.on(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this._showContent,
      this,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_HIDE_TRIGGERED,
      this._hideContent,
      this,
    );
    this._eventEmitter.off(
      UI_EVENTS.CONTROL_BLOCK_SHOW_TRIGGERED,
      this._showContent,
      this,
    );
  }

  private _initUI(elementNodes) {
    const config = {
      elements: elementNodes,
    };

    this.view = new TopBlock.View(config);
  }

  private _getElementNodes(dependencies) {
    const { title, liveIndicator } = dependencies;

    return {
      title: title.node,
      liveIndicator: liveIndicator.node,
    };
  }

  get node() {
    return this.view.getNode();
  }

  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  show() {
    this.isHidden = false;
    this.view.show();
  }

  private _showContent() {
    this._screen.showTopShadow();

    this.view.showContent();
  }

  private _hideContent() {
    this._screen.hideTopShadow();

    this.view.hideContent();
  }

  destroy() {
    this._unbindEvents();
    delete this._eventEmitter;
    delete this._screen;
  }
}
