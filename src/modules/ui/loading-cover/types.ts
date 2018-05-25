type ILoadingCoverViewStyles = {
  loadingCover: string;
  loadingCoverImage: string;
  hidden: string;
};

interface ILoadingCover {
  node: HTMLElement;

  setLoadingCover(src: string): void;

  show(): void;
  hide(): void;

  destroy(): void;
}

export { ILoadingCover, ILoadingCoverViewStyles };
