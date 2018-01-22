type RuleFunction = (data: any) => string;

export interface CSSRule {
  [cssPropName: string]: string | RuleFunction | CSSRule;
}

export interface CSSRules {
  [classImportName: string]: CSSRule;
}

export class StyleSheet {
  private _raw: Map<object, CSSRules> = new Map();
  private _data: any;
  private _styleNode: Element;

  classes: Map<object, object> = new Map();

  attach() {
    this._styleNode = this._styleNode || document.createElement('style');
    const discoveredStyles = [];
    this._raw.forEach((value, key) => {
      discoveredStyles.push(this._convertModuleCSS([key, value]));
    });
    this._styleNode.innerHTML = discoveredStyles.join(' ');

    document.getElementsByTagName('head')[0].appendChild(this._styleNode);
  }

  update(data: any) {
    this._data = data;

    if (this._styleNode) {
      this.attach();
    }
  }

  registerModuleTheme(module: object, rules: CSSRules) {
    //todo maybe we would like to update overrides for module? Or at least show warning instead of Error
    if (this._raw.get(module)) {
      throw new Error('can`t register multiple themes for one module');
    }
    this._raw.set(module, rules);
    this.classes.set(module, this._generateClasses(rules));
  }

  private _generateClasses(rules: CSSRules) {
    return Object.keys(rules).reduce(
      (acc, classImportName) => ({
        ...acc,
        [classImportName]: `wix-vp--${camelToKebab(
          classImportName,
        )}-${randomId()}`,
      }),
      {},
    );
  }

  private _convertModuleCSS = ([module, rules]: [object, CSSRules]) => {
    return Object.keys(rules)
      .map(this._convertCssClass(module))
      .join(' ');
  };

  private _convertCssClass = (module: object) => (classImportName: string) => {
    const moduleRules = this._raw.get(module);
    const moduleClasses = this.classes.get(module);
    if (
      !moduleRules ||
      !moduleRules[classImportName] ||
      !moduleClasses ||
      !moduleClasses[classImportName]
    ) {
      return '';
    }

    const rule = moduleRules[classImportName];

    const complexRuleNames = Object.keys(rule)
      .filter(ruleName => typeof rule[ruleName] === 'object')
      .map(
        ruleName => (ruleName.indexOf('&') !== -1 ? ruleName : `& ${ruleName}`),
      );

    const complexRules = complexRuleNames
      .map(ruleName => {
        const selector = ruleName.replace(
          /&/g,
          `.${moduleClasses[classImportName]}`,
        );
        //don't want to allow deep nesting now, maybe later
        return `${selector} {${this._processSimpleRule(rule[ruleName])}}`;
      })
      .join(' ');

    return `.${moduleClasses[classImportName]} {${this._processSimpleRule(
      rule,
    )}} ${complexRules}`;
  };

  private _processSimpleRule(rule) {
    const simpleRuleNames = Object.keys(rule).filter(
      ruleName => typeof rule[ruleName] !== 'object',
    );
    return simpleRuleNames
      .map(
        ruleName =>
          `${camelToKebab(ruleName)}: ${
            typeof rule[ruleName] === 'function'
              ? (rule[ruleName] as RuleFunction)(this._data)
              : rule[ruleName]
          }`,
      )
      .join('; ');
  }
}

const generatedIds = new Set();
function randomId(): string {
  const id = (Math.random() * 1e4).toFixed(0);

  if (generatedIds.has(id)) {
    return randomId();
  }

  generatedIds.add(id);
  return id;
}

function camelToKebab(string: string): string {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function transperentize(color, alpha) {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r},${g},${b},${alpha})`;
}

export function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function(_, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}
