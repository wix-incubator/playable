export default class View {
  static _styles = {};
  static _translations = {};

  static extendStyleNames(styles) {
    this._styles = { ...this._styles, ...styles };
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
