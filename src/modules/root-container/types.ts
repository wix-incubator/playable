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

interface IRootContainer {
  node: HTMLElement;
  appendComponentNode(node: Element): void;
  attachToElement(element: Element): void;
  setWidth(width: number): void;
  getWidth(): number;
  setHeight(height: number): void;
  getHeight(): number;
  setFillAllSpace(flag: boolean): void;
  hide(): void;
  show(): void;
  destroy(): void;
}

export {
  IPlayerSize,
  IRootContainer,
  IRootContainerViewStyles,
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
};
