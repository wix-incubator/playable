type IRootContainerViewStyles = {
  container: string;
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

interface IRootContainer {
  getElement(): HTMLElement;
  appendComponentElement(element: Element): void;
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
  IRootContainer,
  IRootContainerViewStyles,
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
};
