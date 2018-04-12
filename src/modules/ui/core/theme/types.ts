type ICSSRuleFunction = (data: any) => string;

type ICSSRule = {
  [cssPropName: string]: string | ICSSRuleFunction | ICSSRule;
};

type ICSSRules = {
  [classImportName: string]: ICSSRule;
};

type IThemeConfig = {
  color?: string;
};

export { ICSSRuleFunction, ICSSRule, ICSSRules, IThemeConfig };
