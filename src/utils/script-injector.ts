const injectedScripts: string[] = [];

interface IScriptAttributes {
  async: boolean;
  crossOrigin: string | null;
  text: string;
  type: string;
}

const injectScript = (src: string, props?: IScriptAttributes) => {
  if (injectedScripts.indexOf(src) !== -1) {
    return;
  }

  injectedScripts.push(src);

  const head = document.getElementsByTagName('head')[0];
  const script = document.createElement('script');
  script.src = src;
  script.type = 'text/javascript';

  if (props) {
    script.async = props.async;
    script.crossOrigin = props.crossOrigin;
    script.text = props.text;
    script.type = props.type;
  }

  head.appendChild(script);
};

export default injectScript;
