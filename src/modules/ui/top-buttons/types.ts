interface ITopButtonsViewStyles {
  hidden: string;
  shrinked: string;
}

interface ITopButtons {
  getElement(): HTMLElement;

  destroy(): void;
}

export { ITopButtonsViewStyles, ITopButtons };
