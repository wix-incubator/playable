import classnames from 'classnames';


export default class View {
  static _translations = {};

  static extendStyleNames(styles) {
    if (!this._styles) {
      this._styles = {};
    }

    Object.keys(styles).forEach(styleName => {
      if (this._styles[styleName]) {
        this._styles[styleName] = classnames(this._styles[styleName], styles[styleName]);
      } else {
        this._styles[styleName] = styles[styleName];
      }
    });
  }

  static extendTranslations(translations) {
    this._translations = { ...this._translations, ...translations };
  }

  get styleNames() {
    return this.constructor._styles;
  }

  get translations() {
    return this.constructor._translations;
  }
}
