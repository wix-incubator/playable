import DEFAULT_TEXTS from './default-texts';

import { IPlayerConfig } from '../../core/config';

export default class TextMap implements Playable.ITextMap {
  static moduleName = 'textMap';
  static dependencies = ['config'];

  private _textMap: Playable.ITextMapConfig;

  constructor({ config }: { config: IPlayerConfig }) {
    this._textMap = {
      ...DEFAULT_TEXTS,
      ...config.texts,
    };
  }

  get(id: string, args: any): string {
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
    this._textMap = null;
  }
}
