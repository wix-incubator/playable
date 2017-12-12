import { EventEmitter } from 'eventemitter3';
import { DIRECTIONS, ORIENTATIONS, ANCHOR_POINTS, EVENTS } from '../constants';

const directionsMap = {
  [ORIENTATIONS.HORIZONTAL]: {
    [ANCHOR_POINTS.TOP_LEFT]: DIRECTIONS.STANDARD,
    [ANCHOR_POINTS.TOP_RIGHT]: DIRECTIONS.REVERSE,
    [ANCHOR_POINTS.BOTTOM_LEFT]: DIRECTIONS.STANDARD,
    [ANCHOR_POINTS.BOTTOM_RIGHT]: DIRECTIONS.REVERSE
  },
  [ORIENTATIONS.VERTICAL]: {
    [ANCHOR_POINTS.TOP_LEFT]: DIRECTIONS.STANDARD,
    [ANCHOR_POINTS.TOP_RIGHT]: DIRECTIONS.STANDARD,
    [ANCHOR_POINTS.BOTTOM_LEFT]: DIRECTIONS.REVERSE,
    [ANCHOR_POINTS.BOTTOM_RIGHT]: DIRECTIONS.REVERSE
  }
};

export default class CardsConfig extends EventEmitter {
  constructor() {
    super();
    this._orientation = ORIENTATIONS.HORIZONTAL;
    this._anchorPoint = ANCHOR_POINTS.BOTTOM_LEFT;
    this._isPreviewMode = false;
  }

  get orientation() {
    return this._orientation;
  }

  set orientation(value) {
    this._orientation = value;
    this.emit(EVENTS.CONFIG_CHANGED);
  }

  get anchorPoint() {
    return this._anchorPoint;
  }

  set anchorPoint(value) {
    this._anchorPoint = value;
    this.emit(EVENTS.CONFIG_CHANGED);
  }

  get isPreviewMode() {
    return this._isPreviewMode;
  }

  set isPreviewMode(value) {
    this._isPreviewMode = value;
    this.emit(EVENTS.CONFIG_CHANGED);
  }

  get direction() {
    const { anchorPoint, orientation } = this;
    return directionsMap[orientation][anchorPoint];
  }

  onChange(callback, context) {
    this.on(EVENTS.CONFIG_CHANGED, callback, context);
  }

  destroy() {
    this.eventNames().forEach(eventName => {
      this.removeAllListeners(eventName);
    });
  }
}
