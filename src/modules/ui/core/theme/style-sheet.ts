import camelToKebab from './utils/camelToKebab';
import generateClassNames from './utils/generateClassNames';

export class StyleSheet {
  private _rulesByModule: Map<object, Playable.ICSSRules> = new Map();
  private _classNamesByModule: Map<object, Playable.IStyles> = new Map();
  private _data: any = {};
  private _styleNode: Element;

  attach() {
    this._styleNode = this._styleNode || document.createElement('style');

    const discoveredStyles: string[] = [];
    this._rulesByModule.forEach((_, module) => {
      discoveredStyles.push(this._getModuleCSS(module));
    });

    this._styleNode.innerHTML = discoveredStyles.join(' ');

    document.getElementsByTagName('head')[0].appendChild(this._styleNode);
  }

  update(data: any) {
    this._data = {
      ...this._data,
      ...data,
    };

    if (this._styleNode) {
      this.attach();
    }
  }

  registerModuleTheme(module: object, rules: Playable.ICSSRules) {
    //todo maybe we would like to update overrides for module? Or at least show warning instead of Error
    if (this._rulesByModule.get(module)) {
      throw new Error('can`t register multiple themes for one module');
    }

    this._rulesByModule.set(module, rules);
    this._classNamesByModule.set(module, generateClassNames(rules));
  }

  getModuleClassNames(module: any): Playable.IStyles {
    return this._classNamesByModule.get(module);
  }

  private _getModuleCSS(module: any): string {
    const moduleRules = this._rulesByModule.get(module);
    const moduleClassNames = this._classNamesByModule.get(module);

    if (!moduleRules || !moduleClassNames) {
      return '';
    }

    return Object.keys(moduleRules)
      .map(classImportName =>
        this._getRuleCSS(
          moduleRules[classImportName],
          moduleClassNames[classImportName],
        ),
      )
      .join(' ');
  }

  private _getRuleCSS(rule: Playable.ICSSRule, ruleClassName: string): string {
    if (!rule || !ruleClassName) {
      return '';
    }

    const complexRuleNames = Object.keys(rule)
      .filter(ruleName => typeof rule[ruleName] === 'object')
      .map(
        ruleName => (ruleName.indexOf('&') !== -1 ? ruleName : `& ${ruleName}`),
      );

    const complexRules = complexRuleNames
      .map(ruleName => {
        const selector = ruleName.replace(/&/g, `.${ruleClassName}`);
        //don't want to allow deep nesting now, maybe later
        return `${selector} {${this._getRuleStyles(rule[ruleName])}}`;
      })
      .join(' ');

    return `.${ruleClassName} {${this._getRuleStyles(rule)}} ${complexRules}`;
  }

  private _getRuleStyles(rule: any) {
    const simpleRuleNames: Array<string> = Object.keys(rule).filter(
      ruleName => typeof rule[ruleName] !== 'object',
    );

    return simpleRuleNames
      .map(
        ruleName =>
          `${camelToKebab(ruleName)}: ${
            typeof rule[ruleName] === 'function'
              ? (rule[ruleName] as Playable.ICSSRuleFunction)(this._data)
              : rule[ruleName]
          }`,
      )
      .join('; ');
  }
}
