import { MediaStreamDeliveryType } from '../../../constants';
import View from './debug-panel.view';

const UPDATE_TIME = 1000;

export default class DebugPanel {
  static moduleName = 'debugPanel';
  static View = View;
  static dependencies = ['engine', 'rootContainer'];

  private _engine;

  private _interval;

  view: View;
  isHidden: boolean;

  constructor({ engine, rootContainer }) {
    this._engine = engine;

    this._bindCallbacks();

    this._initUI();

    this.hide();

    rootContainer.appendComponentNode(this.node);
  }

  get node() {
    return this.view.getNode();
  }

  _initUI() {
    this.view = new View({
      callbacks: {
        onCloseButtonClick: this.hide,
      },
    });
  }

  _bindCallbacks() {
    this.updateInfo = this.updateInfo.bind(this);
    this.hide = this.hide.bind(this);
  }

  getDebugInfo() {
    const {
      url,
      type,
      deliveryType,
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
      viewDimensions,
      currentTime,
      duration,
      loadingStateTimestamps,
    } = this._engine.getDebugInfo();

    return {
      url,
      type,
      deliveryType: MediaStreamDeliveryType[deliveryType],
      currentBitrate,
      overallBufferLength,
      nearestBufferSegInfo,
      viewDimensions,
      currentTime,
      duration,
      loadingStateTimestamps,
    };
  }

  updateInfo() {
    this.view.setInfo(this.getDebugInfo());
  }

  setUpdateInterval() {
    this.clearUpdateInterval();
    this._interval = setInterval(this.updateInfo, UPDATE_TIME);
  }

  clearUpdateInterval() {
    clearInterval(this._interval);
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
    delete this.view;
  }
}
