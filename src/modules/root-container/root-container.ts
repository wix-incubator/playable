import ResizeObserver from 'resize-observer-polyfill';

import focusSource from './utils/focus-source';
import focusWithin from './utils/focus-within';

import playerAPI from '../../core/player-api-decorator';

import { UI_EVENTS } from '../../constants';

import View from './root-container.view';
import ElementQueries from '../ui/core/element-queries';

const DEFAULT_CONFIG = {
  fillAllSpace: false,
};

class RootContainer {
  static moduleName = 'rootContainer';
  static dependencies = ['eventEmitter', 'config'];

  private _eventEmitter;

  private _elementQueries: ElementQueries;
  private _resizeObserver: ResizeObserver;
  private _disengageFocusWithin: Function;
  private _disengageFocusSource: Function;

  // TODO: check if props should be `private`
  view: View;
  isHidden: boolean;

  constructor({ eventEmitter, config }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;

    this._bindCallbacks();
    this._initUI(config);

    this._bindEvents();
  }

  /**
   * Getter for DOM node with player UI element
   * (use it only for debug, if you need attach player to your document use `attachToElement` method)
   */
  @playerAPI()
  get node(): Element {
    return this.view.getNode();
  }

  private _bindCallbacks() {
    this._onResized = this._onResized.bind(this);
    this._broadcastMouseEnter = this._broadcastMouseEnter.bind(this);
    this._broadcastMouseMove = this._broadcastMouseMove.bind(this);
    this._broadcastMouseLeave = this._broadcastMouseLeave.bind(this);
  }

  private _bindEvents() {
    this._eventEmitter.on(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.view.setFullScreenStatus,
      this.view,
    );
  }

  private _unbindEvents() {
    this._eventEmitter.off(
      UI_EVENTS.FULLSCREEN_STATUS_CHANGED,
      this.view.setFullScreenStatus,
      this.view,
    );
  }

  private _initUI(config) {
    const sizeConfig = {
      ...config.size,
    };
    this.view = new View({
      callbacks: {
        onMouseEnter: this._broadcastMouseEnter,
        onMouseLeave: this._broadcastMouseLeave,
        onMouseMove: this._broadcastMouseMove,
      },
      width: sizeConfig.width || null,
      height: sizeConfig.height || null,
      fillAllSpace: config.fillAllSpace || DEFAULT_CONFIG.fillAllSpace,
    });

    this._elementQueries = new ElementQueries(this.node, {
      prefix: '',
    });
  }

  appendComponentNode(node) {
    this.view.appendComponentNode(node);
  }

  private _broadcastMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER_TRIGGERED);
  }

  private _broadcastMouseMove() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER_TRIGGERED);
  }

  private _broadcastMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER_TRIGGERED);
  }

  private _enableFocusInterceptors() {
    if (!this._disengageFocusWithin) {
      this._disengageFocusWithin = focusWithin();
    }

    if (!this._disengageFocusSource) {
      focusSource.engage();
      this._disengageFocusSource = focusSource.disengage;
    }
  }

  private _disableFocusInterceptors() {
    if (this._disengageFocusSource) {
      this._disengageFocusSource();
      delete this._disengageFocusSource;
    }

    if (this._disengageFocusWithin) {
      this._disengageFocusWithin();
      delete this._disengageFocusWithin;
    }
  }

  private _onResized() {
    const width = this.view.getWidth();
    const height = this.view.getHeight();

    this._elementQueries.setWidth(width);

    this._eventEmitter.emit(UI_EVENTS.RESIZE, { width, height });
  }

  /**
   * Method for attaching player node to your container
   * It's important to call this methods after `DOMContentLoaded` event!
   *
   * @example
   * document.addEventListener('DOMContentLoaded', function() {
   *   const config = { src: 'http://my-url/video.mp4' }
   *   const player = Playable.create(config);
   *
   *   player.attachToElement(document.getElementById('content'));
   * });
   */
  @playerAPI()
  attachToElement(element: Element) {
    this._enableFocusInterceptors();

    element.appendChild(this.node);

    if (!this._resizeObserver) {
      // NOTE: required for valid work of player "media queries"
      this._resizeObserver = new ResizeObserver(this._onResized);

      this._resizeObserver.observe(this.node);
    }
  }

  /**
   * Method for setting width of player
   * @param width - Desired width of player in pixels
   * @example
   * player.setWidth(400);
   */
  @playerAPI()
  setWidth(width: number) {
    this.view.setWidth(width);
    this._eventEmitter.emit(UI_EVENTS.PLAYER_WIDTH_CHANGE_TRIGGERED, width);
  }

  /**
   * Return current width of player in pixels
   * @example
   * player.getWidth(); // 400
   */
  @playerAPI()
  getWidth(): number {
    return this.view.getWidth();
  }

  /**
   * Method for setting width of player
   * @param height - Desired height of player in pixels
   * @example
   * player.setHeight(225);
   */
  @playerAPI()
  setHeight(height: number) {
    this.view.setHeight(height);
    this._eventEmitter.emit(UI_EVENTS.PLAYER_HEIGHT_CHANGE_TRIGGERED, height);
  }

  /**
   * Return current height of player in pixels
   * @example
   * player.getHeight(); // 225
   */
  @playerAPI()
  getHeight(): number {
    return this.view.getHeight();
  }

  /**
   * Method for allowing player fill all available space
   * @param flag - `true` for allowing
   * @example
   * player.setFillAllSpace(true);
   */
  @playerAPI()
  setFillAllSpace(flag: boolean) {
    this.view.setFillAllSpaceFlag(flag);
  }

  /**
   * Hide whole ui
   * @example
   * player.hide();
   */
  @playerAPI()
  hide() {
    this.isHidden = true;
    this.view.hide();
  }

  /**
   * Show whole ui
   * @example
   * player.show();
   */
  @playerAPI()
  show() {
    this.isHidden = false;
    this.view.show();
  }

  destroy() {
    this._unbindEvents();
    this._disableFocusInterceptors();

    if (this._resizeObserver) {
      this._resizeObserver.unobserve(this.node);
      this._resizeObserver = null;
    }

    this._elementQueries.destroy();
    this._elementQueries = null;

    this.view.destroy();
    this.view = null;

    this._eventEmitter = null;
  }
}

export default RootContainer;
