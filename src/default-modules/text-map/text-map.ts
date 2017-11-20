import DEFAULT_TEXTS from './default-texts';

export default class TextMap {
  static dependencies = ['config'];

  private _textMap;

  constructor({ config }) {
    this._textMap = {
      ...DEFAULT_TEXTS,
      ...config.textMap,
    };
  }

  get(id, args) {
    if (!this._textMap) {
      return;
    }

    const text = this._textMap[id];

    if (typeof text === 'function') {
      return text(args);
    }

    return text;
  }

  destroy() {
    delete this._textMap;
  }
}
