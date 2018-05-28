import { UI_EVENTS } from '../../../constants';
import playerAPI from '../../../core/player-api-decorator';

import SubtitlesView from './subtitles.view';
import { ISubtitles, ISubtitleConfig } from './types';
import { IEventEmitter } from '../../event-emitter/types';
import { IRootContainer } from '../../root-container/types';
import { IPlaybackEngine } from '../../playback-engine/types';

export default class Subtitles implements ISubtitles {
  static moduleName = 'subtitle';
  static dependencies = ['rootContainer', 'engine', 'eventEmitter'];
  static View = SubtitlesView;

  isHidden: boolean;
  view: SubtitlesView;

  private _eventEmitter: IEventEmitter;
  private _video: HTMLVideoElement;
  private _activeSubtitleIndex: number | null = null;
  private _trackList: Array<TextTrack> = [];

  private _unbindEvents: Function;

  constructor({
    rootContainer,
    engine,
    eventEmitter,
  }: {
    rootContainer: IRootContainer;
    engine: IPlaybackEngine;
    eventEmitter: IEventEmitter;
  }) {
    this._eventEmitter = eventEmitter;
    this._video = engine.getNode();

    this._initUI();
    this._bindCallbacks();
    this._bindEvents();

    rootContainer.appendComponentNode(this.node);
  }

  @playerAPI()
  setSubtitles(
    subtitles: string | ISubtitleConfig | Array<ISubtitleConfig>,
  ): void {
    this.removeSubtitles();
    if (!subtitles) {
      return;
    }
    if (typeof subtitles === 'string') {
      this._addSubtitle(subtitles);
    } else if (Array.isArray(subtitles)) {
      subtitles.forEach(subtitle => this._addSubtitle(subtitle));
    } else {
      this._addSubtitle(subtitles);
    }
  }

  @playerAPI()
  setActiveSubtitle(index: number): void {
    this._clearActiveSubtitle();
    this._setActiveSubtitle(index);
  }

  @playerAPI()
  showSubtitles(): void {
    this.view.show();
  }

  @playerAPI()
  hideSubtitles(): void {
    this.view.hide();
  }

  private _addSubtitle(subtitle: string | ISubtitleConfig): void {
    const track = document.createElement('track');

    if (typeof subtitle === 'string') {
      track.setAttribute('src', subtitle);
    } else {
      track.setAttribute('src', subtitle.src);
      subtitle.lang && track.setAttribute('srclang', subtitle.lang);
      subtitle.label && track.setAttribute('label', subtitle.label);
    }

    track.setAttribute('kind', 'subtitles');

    this._video.appendChild(track);
    this._trackList.push(
      this._video.textTracks[this._video.textTracks.length - 1],
    );
  }

  @playerAPI()
  removeSubtitles(): void {
    this._clearActiveSubtitle();
    const subtitleTracks: NodeList = this._video.querySelectorAll(
      'track[kind="subtitles"]',
    );

    Array.prototype.forEach.call(subtitleTracks, trackNode =>
      this._video.removeChild(trackNode),
    );

    this._trackList = [];
  }

  private _clearActiveSubtitle(): void {
    if (this._activeSubtitleIndex) {
      const textTrack: TextTrack = this._trackList[this._activeSubtitleIndex];

      textTrack.removeEventListener('cuechange', this._showSubtitles);
      textTrack.mode = 'disabled';

      this._activeSubtitleIndex = null;
    }

    this.view.clearSubtitles();
  }

  private _setActiveSubtitle(index: number): void {
    const textTrack: TextTrack = this._trackList[index];

    if (textTrack) {
      textTrack.mode = 'hidden';
      textTrack.addEventListener('cuechange', this._showSubtitles);
      textTrack.activeCues &&
        this.view.showSubtitles(
          Array.prototype.map.call(textTrack.activeCues, cue => cue.text),
        );
    }

    this._activeSubtitleIndex = index;
  }

  get node(): HTMLElement {
    return this.view.getNode();
  }

  private _initUI(): void {
    this.view = new Subtitles.View();
  }

  private _bindCallbacks(): void {
    this._showSubtitles = this._showSubtitles.bind(this);
  }

  private _bindEvents(): void {
    this._unbindEvents = this._eventEmitter.bindEvents(
      [
        [
          UI_EVENTS.MAIN_BLOCK_SHOW_TRIGGERED,
          this.view.moveSubtitlesUp,
          this.view,
        ],
        [
          UI_EVENTS.MAIN_BLOCK_HIDE_TRIGGERED,
          this.view.moveSubtitlesDown,
          this.view,
        ],
      ],
      this,
    );
  }

  private _showSubtitles(event: TrackEvent): void {
    const textTrack: TextTrack = event.target as TextTrack;
    this.view.showSubtitles(
      Array.prototype.map.call(textTrack.activeCues, cue => cue.text),
    );
  }

  destroy(): void {
    this._unbindEvents();

    this._eventEmitter = null;
    this._video = null;
  }
}
