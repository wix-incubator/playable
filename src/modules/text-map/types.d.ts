declare namespace Playable {
  export type TextResolver = (args: any) => string;

  export interface ITextMapConfig {
    [index: string]: string | TextResolver;
  }

  export interface ITextMap {
    get(id: string, args?: any): string;
    destroy(): void;
  }
}
