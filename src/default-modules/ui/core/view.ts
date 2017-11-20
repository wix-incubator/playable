import * as classnames from 'classnames';

export default class View {
  private static _styles;

  static extendStyleNames(styles) {
    if (!this._styles) {
      this._styles = {};
    }

    Object.keys(styles).forEach(styleName => {
      if (this._styles[styleName]) {
        this._styles[styleName] = classnames(
          this._styles[styleName],
          styles[styleName],
        );
      } else {
        this._styles[styleName] = styles[styleName];
      }
    });
  }

  static resetStyles() {
    this._styles = {};
  }

  // tslint:disable-next-line
  constructor(config?) {}

  get styleNames() {
    return (this.constructor as any)._styles || {};
  }
}
