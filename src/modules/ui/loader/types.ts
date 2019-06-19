type ILoaderViewStyles = {
  loader: string;
  active: string;
  hidden: string;
};

interface ILoader {
  hide(): void;
  show(): void;
  getElement(): HTMLElement;
  stopDelayedShow(): void;
  isDelayedShowScheduled: Boolean;
  destroy(): void;
}

export { ILoaderViewStyles, ILoader };
