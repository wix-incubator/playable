declare namespace Playable {
  interface IPlayer {
    node?: HTMLElement;
    attachToElement?(element: Element): void;
    setWidth?(width: number): void;
    getWidth?(): number;
    setHeight?(height: number): void;
    getHeight?(): number;
    setFillAllSpace?(flag: boolean): void;
    hide?(): void;
    show?(): void;
  }

  export interface IRootContainerViewStyles {
    videoWrapper: string;
    fillAllSpace: string;
    fullScreen: string;
    hidden: string;
  }

  export interface IRootContainerViewCallbacks {
    onMouseEnter: EventListener;
    onMouseMove: EventListener;
    onMouseLeave: EventListener;
  }

  export interface IRootContainerViewConfig {
    width: number;
    height: number;
    fillAllSpace: boolean;
    callbacks: IRootContainerViewCallbacks;
  }

  export interface IPlayerSize {
    width: number;
    height: number;
  }

  export interface IRootContainer {
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
}
