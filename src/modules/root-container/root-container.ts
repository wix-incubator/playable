import ResizeObserver from 'resize-observer-polyfill';

import focusSource from './utils/focus-source';
import focusWithin from './utils/focus-within';

import playerAPI from '../../core/player-api-decorator';

import { UI_EVENTS } from '../../constants';

import View from './root-container.view';
import ElementQueries from '../ui/core/element-queries';

import { IEventEmitter } from '../event-emitter/types';
import { IRootContainer } from './types';
import { IPlayerConfig } from '../../core/config';

const DEFAULT_CONFIG = {
  fillAllSpace: false,
};

class RootContainer implements IRootContainer {
  static moduleName = 'rootContainer';
  static dependencies = ['eventEmitter', 'config'];

  private _eventEmitter: IEventEmitter;

  private _elementQueries: ElementQueries;
  private _resizeObserver: ResizeObserver;
  private _disengageFocusWithin: () => void;
  private _disengageFocusSource: () => void;

  private _unbindEvents: () => void;

  // TODO: check if props should be `private`
  view: View;
  isHidden: boolean;

  constructor({
    eventEmitter,
    config,
  }: {
    config: IPlayerConfig;
    eventEmitter: IEventEmitter;
  }) {
    this._eventEmitter = eventEmitter;
    this.isHidden = false;

    this._bindCallbacks();
    this._initUI(config);

    this._bindEvents();
  }

  /**
   * Getter for DOM element with player UI
   * (use it only for debug, if you need attach player to your document use `attachToElement` method)
   */
  @playerAPI()
  getElement(): HTMLElement {
    return this.view.getElement();
  }

  private _bindCallbacks() {
    this._onResized = this._onResized.bind(this);
    this._broadcastMouseEnter = this._broadcastMouseEnter.bind(this);
    this._broadcastMouseMove = this._broadcastMouseMove.bind(this);
    this._broadcastMouseLeave = this._broadcastMouseLeave.bind(this);
    this._broadcastFocusEnter = this._broadcastFocusEnter.bind(this);
    this._broadcastFocusLeave = this._broadcastFocusLeave.bind(this);
  }

  private _bindEvents() {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [
          UI_EVENTS.FULL_SCREEN_STATE_CHANGED,
          this.view.setFullScreenState,
          this.view,
        ],
      ],
      this,
    );
  }

  private _initUI(config: IPlayerConfig) {
    this.view = new View({
      callbacks: {
        onMouseEnter: this._broadcastMouseEnter,
        onMouseLeave: this._broadcastMouseLeave,
        onMouseMove: this._broadcastMouseMove,
      },
      width: config.width || null,
      height: config.height || null,
      fillAllSpace: config.fillAllSpace || DEFAULT_CONFIG.fillAllSpace,
    });

    this._elementQueries = new ElementQueries(this.getElement());

    this._resizeObserver = new ResizeObserver(this._onResized);
    this._resizeObserver.observe(this.getElement());
  }

  appendComponentElement(element: HTMLElement) {
    this.view.appendComponentElement(element);
  }

  private _broadcastMouseEnter() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_ENTER_ON_PLAYER);
  }

  private _broadcastMouseMove() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_MOVE_ON_PLAYER);
  }

  private _broadcastMouseLeave() {
    this._eventEmitter.emit(UI_EVENTS.MOUSE_LEAVE_ON_PLAYER);
  }

  private _broadcastFocusEnter() {
    this._eventEmitter.emit(UI_EVENTS.FOCUS_ENTER_ON_PLAYER);
  }

  private _broadcastFocusLeave() {
    this._eventEmitter.emit(UI_EVENTS.FOCUS_LEAVE_ON_PLAYER);
  }

  private _enableFocusInterceptors() {
    if (!this._disengageFocusWithin) {
      this._disengageFocusWithin = focusWithin(
        this.getElement(),
        this._broadcastFocusEnter,
        this._broadcastFocusLeave,
      );
    }

    if (!this._disengageFocusSource) {
      focusSource.engage();
      this._disengageFocusSource = focusSource.disengage;
    }
  }

  private _disableFocusInterceptors() {
    if (this._disengageFocusSource) {
      this._disengageFocusSource();
      this._disengageFocusSource = null;
    }

    if (this._disengageFocusWithin) {
      this._disengageFocusWithin();
      this._disengageFocusWithin = null;
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

    element.appendChild(this.getElement());
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

    this._resizeObserver.unobserve(this.getElement());
    this._elementQueries.destroy();

    this.view.destroy();
  }
}

export default RootContainer;
