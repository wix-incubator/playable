interface IPlaybackAdapter {
  syncWithLiveTime: number;
  isDynamicContent: boolean;
  isSyncWithLive: boolean;

  isSeekAvailable: boolean;

  // TODO: describe adapter interface
}

export { IPlaybackAdapter };
