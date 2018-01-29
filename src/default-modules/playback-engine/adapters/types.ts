interface IPlaybackAdapter {
  syncWithLiveTime: number;
  isDynamicContent: boolean;
  isDynamicContentEnded: boolean;
  isSyncWithLive: boolean;

  isSeekAvailable: boolean;

  // TODO: describe adapter interface
}

export { IPlaybackAdapter };
