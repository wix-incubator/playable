interface IChromecastManager {
  isCasting: boolean;
  isEnabled: boolean;
  destroy(): void;
}

export { IChromecastManager };
