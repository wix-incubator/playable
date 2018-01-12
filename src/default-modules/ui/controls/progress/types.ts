type IProgressViewStyles = {
  'seek-block': string;
  'progress-bars-wrapper': string;
  'progress-bar': string;
  background: string;
  buffered: string;
  'seek-to': string;
  played: string;
  'time-indicators': string;
  hitbox: string;
  'sync-button': string;
  hidden: string;
  'in-live': string;
  'is-dragging': string;
};

type IProgressViewCallbacks = {
  onChangePlayedProgress: Function;
  onSyncWithLiveClick: Function;
  onDragStart: Function;
  onDragEnd: Function;
};

type IProgressViewOptions = {
  callbacks: IProgressViewCallbacks;
  texts: any;
};

export { IProgressViewStyles, IProgressViewCallbacks, IProgressViewOptions };
