import { DIRECTIONS, ORIENTATIONS, ANCHOR_POINTS } from '../constants';

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

export default class CardsConfig {
  constructor() {
    this.direction = DIRECTIONS.STANDARD;
    this.orientation = ORIENTATIONS.HORIZONTAL;
    this.anchorPoint = ANCHOR_POINTS.BOTTOM_LEFT;
    this.isPreviewMode = false;
  }

  setOrientation(orientation) {
    this.orientation = orientation;
    this.updateDirection();
  }

  setAnchorPoint(anchorPoint) {
    this.anchorPoint = anchorPoint;
    this.updateDirection();
  }

  updateDirection() {
    const { anchorPoint, orientation } = this;
    this.direction = directionsMap[orientation][anchorPoint];
  }
}
