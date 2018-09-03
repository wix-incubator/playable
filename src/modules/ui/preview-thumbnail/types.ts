interface IPreviewThumbnail {
  getElement(): HTMLElement;

  showAt(second: number): void;
  setTime(time: string): void;

  destroy(): void;
}

interface IPreviewThumbnailViewStyles {
  container: string;
  highQualityFrame: string;
  lowQualityFrame: string;
  thumbText: string;
  empty: string;
}

export { IPreviewThumbnailViewStyles, IPreviewThumbnail };
