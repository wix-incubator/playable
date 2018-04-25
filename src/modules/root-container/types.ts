type IRootContainerViewStyles = {
  videoWrapper: string;
  fillAllSpace: string;
  fullScreen: string;
  hidden: string;
};

type IRootContainerViewCallbacks = {
  onMouseEnter: EventListener;
  onMouseMove: EventListener;
  onMouseLeave: EventListener;
};

type IRootContainerViewConfig = {
  width: number;
  height: number;
  fillAllSpace: boolean;
  callbacks: IRootContainerViewCallbacks;
};

interface IPlayerSize {
  width: number;
  height: number;
}

export {
  IPlayerSize,
  IRootContainerViewStyles,
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
};
