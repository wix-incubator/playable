declare namespace Playable {
  interface IPlayer {
    setTitle?(title?: string): void;
    setTitleClickCallback?(callback?: Function): void;
  }

  export type ITitleViewStyles = {
    title: string;
    link: string;
    hidden: string;
  };

  export type ITitleViewCallbacks = {
    onClick: EventListenerOrEventListenerObject;
  };

  export type ITitleViewConfig = {
    callbacks: ITitleViewCallbacks;
    theme: Playable.IThemeService;
  };

  export interface ITitleConfig {
    text?: string;
    callback?: Function;
  }

  export interface ITitle {
    node: HTMLElement;
    setTitle(title?: string): void;
    setTitleClickCallback(callback?: Function): void;

    show(): void;
    hide(): void;

    destroy(): void;
  }
}
