type IStyles = {
  [className: string]: string;
};

interface IStylable<TStyles = IStyles> {
  styleNames: TStyles;
}

interface IView<TStyles = IStyles> extends IStylable<TStyles> {}

export { IStyles, IStylable, IView };
