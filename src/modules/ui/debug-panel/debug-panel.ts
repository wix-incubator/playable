import { MediaStreamDeliveryPriority } from '../../../constants';
import View from './debug-panel.view';

import { KEYCODES } from '../../../utils/keyboard-interceptor';

import { IPlaybackEngine } from '../../playback-engine/types';
import { IRootContainer } from '../../root-container/types';
import { IKeyboardControl } from '../../keyboard-control/types';

const UPDATE_TIME = 1000;

export default class DebugPanel {
  static moduleName = 'debugPanel';
  static View = View;
  static dependencies = ['engine', 'rootContainer', 'keyboardControl'];

  private _engine: IPlaybackEngine;

  private _interval: number;

  view: View;
  isHidden: boolean;

  constructor({
    engine,
    rootContainer,
    keyboardControl,
  }: {
    engine: IPlaybackEngine;
    rootContainer: IRootContainer;
    keyboardControl: IKeyboardControl;
  }) {
    this._engine = engine;

    this._bindCallbacks();
    this._initUI();

    this.hide();

    rootContainer.appendComponentElement(this.getElement());

    keyboardControl.addKeyControl(KEYCODES.DEBUG_KEY, this._keyControlCallback);
  }

  private _keyControlCallback(e: KeyboardEvent) {
    if (e.ctrlKey && e.shiftKey) {
      this.show();
    }
  }

  getElement() {
    return this.view.getElement();
  }

  private _initUI() {
    this.view = new View({
      callbacks: {
        onCloseButtonClick: this.hide,
      },
    });
  }

  private _bindCallbacks() {
    this.updateInfo = this.updateInfo.bind(this);
    this.hide = this.hide.bind(this);
    this._keyControlCallback = this._keyControlCallback.bind(this);
  }

  getDebugInfo() {
    const info = this._engine.getDebugInfo();

    if (info.output === 'html5video') {
      const {
        url,
        type,
        deliveryPriority,
        currentBitrate,
        overallBufferLength,
        nearestBufferSegInfo,
        viewDimensions,
        currentTime,
        duration,
        loadingStateTimestamps,
        bitrates,
        bwEstimate,
        output,
      } = info;

      return {
        url,
        type,
        deliveryPriority: MediaStreamDeliveryPriority[deliveryPriority],
        currentBitrate,
        overallBufferLength,
        nearestBufferSegInfo,
        viewDimensions,
        currentTime,
        duration,
        loadingStateTimestamps,
        bitrates,
        bwEstimate,
        output,
      };
    }

    if (info.output === 'chromecast') {
      return info;
    }
  }

  updateInfo() {
    this.view.setInfo(this.getDebugInfo());
  }

  setUpdateInterval() {
    this.clearUpdateInterval();
    this._interval = window.setInterval(this.updateInfo, UPDATE_TIME);
  }

  clearUpdateInterval() {
    window.clearInterval(this._interval);
  }

  show() {
    if (this.isHidden) {
      this.updateInfo();
      this.setUpdateInterval();
      this.view.show();
      this.isHidden = false;
    }
  }

  hide() {
    if (!this.isHidden) {
      this.clearUpdateInterval();
      this.view.hide();
      this.isHidden = true;
    }
  }

  destroy() {
    this.clearUpdateInterval();

    this.view.destroy();
  }
}
