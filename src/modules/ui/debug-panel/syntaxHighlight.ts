import { IDebugPanelHighlightStyles } from './types';

function syntaxHighlight(json, styleNames: IDebugPanelHighlightStyles) {
  json = json
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    match => {
      let cls = styleNames.number;
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = styleNames.key;
        } else {
          cls = styleNames.string;
        }
      } else if (/true|false/.test(match)) {
        cls = styleNames.boolean;
      } else if (/null/.test(match)) {
        cls = styleNames.null;
      }
      return `<span class="${cls}">${match}</span>`;
    },
  );
}

export default syntaxHighlight;
