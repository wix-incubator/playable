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

export {
  IRootContainerViewStyles,
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
};
