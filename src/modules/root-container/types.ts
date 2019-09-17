type IRootContainerViewStyles = {
  container: string;
  fillAllSpace: string;
  fullScreen: string;
  hidden: string;
  rtl: boolean;
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
  rtl: boolean;
};

interface IRootContainer {
  getElement(): HTMLElement;
  appendComponentElement(element: HTMLElement): void;
  attachToElement(element: HTMLElement): void;
  setWidth(width: number): void;
  getWidth(): number;
  setHeight(height: number): void;
  getHeight(): number;
  setRtl(rtl: boolean): void;
  setFillAllSpace(flag: boolean): void;
  hide(): void;
  show(): void;
  destroy(): void;
}

interface IRootContainerAPI {
  getElement?(): HTMLElement;
  attachToElement?(element: HTMLElement): void;
  setWidth?(width: number): void;
  getWidth?(): number;
  setHeight?(height: number): void;
  getHeight?(): number;
  setFillAllSpace?(flag: boolean): void;
  setRtl?(rtl: boolean): void;
  hide?(): void;
  show?(): void;
}

export {
  IRootContainerAPI,
  IRootContainer,
  IRootContainerViewStyles,
  IRootContainerViewCallbacks,
  IRootContainerViewConfig,
};
