declare module '*.scss';
declare module '*.svg';
declare module '*.dot';

declare namespace Playable {
  export interface IPlayer {
    destroy(): void;
  }
}
