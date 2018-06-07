declare namespace Playable {
  export type IStyles = {
    [className: string]: string;
  };

  export interface IStylable<TStyles = IStyles> {
    styleNames: TStyles;
  }

  export interface IView<TStyles = IStyles> extends IStylable<TStyles> {}
}
