import { IStyles } from '../types';

type ICSSRuleFunction = (data: any) => string;

type ICSSRule = {
  [cssPropName: string]: string | ICSSRuleFunction | ICSSRule;
};

type ICSSRules = {
  [classImportName: string]: ICSSRule;
};

type IThemeConfig = {
  color?: string;
  progressColor?: string;
};

interface IThemeService {
  updateTheme(config: IThemeConfig): void;
  registerModuleTheme(module: object, rules: ICSSRules): void;
  get(module: object): IStyles;
  destroy(): void;
}

interface IThemeAPI {
  updateTheme?: (themeConfig: IThemeConfig) => void;
}

export {
  IThemeAPI,
  IThemeService,
  ICSSRuleFunction,
  ICSSRule,
  ICSSRules,
  IThemeConfig,
};
