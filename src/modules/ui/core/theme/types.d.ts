declare namespace Playable {
  interface IPlayer {
    updateTheme?(config: Playable.IThemeConfig): void;
  }

  export type ICSSRuleFunction = (data: any) => string;

  export type ICSSRule = {
    [cssPropName: string]: string | ICSSRuleFunction | ICSSRule;
  };

  export type ICSSRules = {
    [classImportName: string]: ICSSRule;
  };

  export type IThemeConfig = {
    color?: string;
    [id: string]: any;
  };

  export interface IThemeService {
    updateTheme(config: Playable.IThemeConfig): void;
    registerModuleTheme(module: object, rules: Playable.ICSSRules): void;
    get(module: object): Playable.IStyles;
    destroy(): void;
  }
}
