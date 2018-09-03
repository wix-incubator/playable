interface IPreviewFullSize {
  getElement(): HTMLElement;

  showAt(second: number): void;
  hide(): void;

  destroy(): void;
}

interface IPreviewFullSizeViewStyles {
  container: string;
  frame: string;
  hidden: string;
}

export { IPreviewFullSizeViewStyles, IPreviewFullSize };
