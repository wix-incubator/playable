import playerAPI from '../../../core/player-api-decorator';

import { IPlaybackEngine } from '../../playback-engine/types';

import { getAt } from './adapter';
import {
  IPreviewService,
  IFramesData,
  INormalizedFramesQuality,
} from './types';

export default class PreviewService implements IPreviewService {
  static moduleName = 'previewService';
  static dependencies = ['engine'];

  private _engine: IPlaybackEngine;

  private _framesMap: IFramesData;

  constructor({ engine }: { engine: IPlaybackEngine }) {
    this._engine = engine;
  }

  @playerAPI()
  setFramesMap(map: IFramesData) {
    this._framesMap = map;
  }

  getAt(second: number): INormalizedFramesQuality[] {
    if (!this._framesMap) {
      return;
    }

    const duration = this._engine.getDuration();
    if (!duration) {
      return;
    }

    return getAt(this._framesMap, second, duration);
  }

  destroy(): void {
    this._engine = null;
  }
}
