interface IPreviewThumbnail {
  getElement(): HTMLElement;

  showAt(second: number): void;
  setTime(time: string): void;

  destroy(): void;
}

export { IPreviewThumbnail };
