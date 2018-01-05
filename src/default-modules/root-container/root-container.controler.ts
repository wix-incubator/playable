import * as get from 'lodash/get';

import { ElementQueries } from 'css-element-queries';
import focusSource from '../../utils/focus-source';
import focusWithin from '../../utils/focus-within';

import playerAPI from '../../utils/player-api-decorator';

import { UI_EVENTS } from '../../constants/index';

import View from './root-container.view';

const DEFAULT_CONFIG = {
  fillAllSpace: false,
};

export interface IPlayerSize {
  width: number;
  height: number;
}

class RootContainer {
  static dependencies = ['eventEmitter', 'config', 'engine'];

  private _eventEmitter;
  private _engine;
  private _disengageFocusWithin;
  private _disengageFocusSource;

  // TODO: check if props should be `private`
  view: View;
  isHidden: boolean;

  constructor({ eventEmitter, config, engine }) {
    this._eventEmitter = eventEmitter;
    this._engine = engine;
    this.isHidden = false;

    this._initUI(config);

    this._bindEvents();
  }

  /**
   * Getter for DOM node with player UI element
   * (use it only for debug, if you need attach player to your document use `attachToElement` method)
   */
  @playerAPI()
  get node(): Node {
    return this.view.getNode();
  }

  _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.view.setFullScreenStatus,
      this.view,
    );
  }

  _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.view.setFullScreenStatus,
      this.view,
    );
  }

  _initUI(config) {
    this.view = new View({
      width: get(config, 'size.width', null),
      height: get(config, 'size.height', null),
      fillAllSpace: get(config, 'fillAllSpace', DEFAULT_CONFIG.fillAllSpace),
    });
  }

  appendComponentNode(node) {
    this.view.appendComponentNode(node);
  }

  _enableFocusInterceptors() {
    if (!this._disengageFocusWithin) {
      this._disengageFocusWithin = focusWithin();
    }

    if (!this._disengageFocusSource) {
      focusSource.engage();
      this._disengageFocusSource = focusSource.disengage;
    }
  }

  _disableFocusInterceptors() {
    if (this._disengageFocusSource) {
      this._disengageFocusSource();
      delete this._disengageFocusSource;
    }

    if (this._disengageFocusWithin) {
      this._disengageFocusWithin();
      delete this._disengageFocusWithin;
    }
  }

  /**
   * Method for attaching player node to your container
   * It's important to call this methods after `DOMContentLoaded` event!
   *
   * @example
   * document.addEventListener('DOMContentLoaded', function() {
   *   const config = { src: 'http://my-url/video.mp4' }
   *   const player = VideoPlayer.create(config);
   *
   *   player.attachToElement(document.getElementById('content'));
   * });
   */
  @playerAPI()
  attachToElement(node: Node) {
    this._enableFocusInterceptors();

    node.appendChild(this.node);
    ElementQueries.init();
  }

  /**
   * Hide whole ui
   */
  @playerAPI()
  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  /**
   * Show whole ui
   */
  @playerAPI()
  show() {
    this.isHidden = false;
    this.view.show();
  }

  /**
   * Method for setting width of player
   *
   * @param width - Desired width of player in pixels
   */
  @playerAPI()
  setWidth(width: number) {
    this.view.setWidth(width);
    this._eventEmitter.emit(UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED, width);
  }

  /**
   * Method for setting width of player
   *
   * @param height - Desired height of player in pixels
   */
  @playerAPI()
  setHeight(height: number) {
    this.view.setHeight(height);
    this._eventEmitter.emit(UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED, height);
  }

  /**
   * Return current width of player in pixels
   */
  @playerAPI()
  getWidth(): number {
    return this.view.getWidth();
  }

  /**
   * Return current height of player in pixels
   */
  @playerAPI()
  getHeight(): number {
    return this.view.getHeight();
  }

  /**
   * Method for allowing player fill all available space
   *
   * @param flag - True for allowing
   */
  @playerAPI()
  setFillAllSpace(flag: boolean) {
    this.view.setFillAllSpaceFlag(flag);
  }

  destroy() {
    this._unbindEvents();
    this._disableFocusInterceptors();

    this.view.destroy();
    delete this.view;

    delete this._engine;
    delete this._eventEmitter;
  }
}

export default RootContainer;
