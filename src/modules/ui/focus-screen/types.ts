type IFocusScreenViewStyles = {
  focusScreen: string;
  hiddenCursor: string;
  hidden: string;
};

type IFocusScreenViewCallbacks = {
  onWrapperMouseClick: EventListenerOrEventListenerObject;
  onWrapperMouseDblClick: EventListenerOrEventListenerObject;
};

type IFocusScreenViewConfig = {
  callbacks: IFocusScreenViewCallbacks;
};

interface IFocusScreen {
  getElement(): HTMLElement;
  showCursor(): void;
  hideCursor(): void;

  show(): void;
  hide(): void;

  focus(): void;

  destroy(): void;
}

export {
  IFocusScreen,
  IFocusScreenViewStyles,
  IFocusScreenViewCallbacks,
  IFocusScreenViewConfig,
};
