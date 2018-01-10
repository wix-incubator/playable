type RuleFunction = (data: any) => string;

export interface CSSRule {
  [cssPropName: string]: string | RuleFunction;
}

export interface CSSRules {
  [classImportName: string]: CSSRule;
}

export class StyleSheet {
  public classes = {};

  private raw: CSSRules;
  private data: any;
  private styleNode: Element;

  constructor(rules: CSSRules) {
    this.raw = rules;
    this.classes = Object.keys(rules).reduce(
      (acc, classImportName) => ({
        ...acc,
        [classImportName]: `${camelToKebab(classImportName)}-${Date.now()
          .toString()
          .slice(-5)}`,
      }),
      {},
    );
  }

  public attach() {
    this.styleNode = this.styleNode || document.createElement('style');
    this.styleNode.innerHTML = Object.keys(this.raw)
      .map(this.convertCssClass)
      .join(' ');

    document.getElementsByTagName('head')[0].appendChild(this.styleNode);
  }

  public update(data: any) {
    this.data = data;

    if (this.styleNode) {
      this.attach();
    }
  }

  private convertCssClass = (classImportName: string) => {
    const rule = this.raw[classImportName];
    if (!rule) {
      return '';
    }

    const rules = Object.keys(rule)
      .map(
        ruleName =>
          `${camelToKebab(ruleName)}: ${
            typeof rule[ruleName] === 'function'
              ? (rule[ruleName] as RuleFunction)(this.data)
              : rule[ruleName]
          }`,
      )
      .join('; ');

    return `.${this.classes[classImportName]} {${rules}}`;
  };
}

function camelToKebab(string: string): string {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}
