const injectedScripts = new Set();

const injectScript = (src: string, props?: any) => {
  if (injectedScripts.has(src)) {
    return;
  }

  const _props = {
    src,
    type: 'text/javascript',
    ...props,
  };

  injectedScripts.add(src);

  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');

  Object.keys(_props).forEach((key: string) => {
    // @ts-ignore - TS7017: Element implicitly has an 'any' type because type 'HTMLScriptElement' has no index signature.
    script[key] = _props[key];
  });

  head.appendChild(script);
};

export default injectScript;
