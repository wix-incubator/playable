type IDebugPanelHighlightStyles = {
  key: string;
  number: string;
  string: string;
  boolean: string;
  null: string;
};

type IDebugPanelViewStyles = IDebugPanelHighlightStyles & {
  debugPanel: string;
  infoContainer: string;
  closeButton: string;
  hidden: string;
};

type IDebugPanelViewCallbacks = {
  onCloseButtonClick: EventListenerOrEventListenerObject;
};

type IDebugPanelViewConfig = {
  callbacks: IDebugPanelViewCallbacks;
};

export {
  IDebugPanelHighlightStyles,
  IDebugPanelViewStyles,
  IDebugPanelViewCallbacks,
  IDebugPanelViewConfig,
};
