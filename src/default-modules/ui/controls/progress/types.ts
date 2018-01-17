type IProgressViewStyles = {
  seekBlock: string;
  progressBarsWrapper: string;
  progressBar: string;
  background: string;
  buffered: string;
  seekTo: string;
  played: string;
  timeIndicators: string;
  hitbox: string;
  syncButton: string;
  hidden: string;
  inLive: string;
  isDragging: string;
  liveSync: string;
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
