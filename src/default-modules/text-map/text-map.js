export default class TextMap {
  static dependencies = ['config'];

  constructor({ config }) {
    this._textMap = config.textMap;
  }

  get(id) {
    if (!this._textMap) {
      return;
    }

    return this._textMap[id];
  }

  destroy() {
    delete this._textMap;
  }
}
