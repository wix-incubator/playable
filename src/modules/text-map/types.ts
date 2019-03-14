type TextResolver = (args: any) => string;

interface ITextMapConfig {
  [index: string]: string | TextResolver;
}

interface ITextMap {
  get(id: string, args?: any, defaultText?: string | Function): string;
  destroy(): void;
}

export { TextResolver, ITextMap, ITextMapConfig };
