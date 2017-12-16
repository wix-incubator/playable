import { render } from './tmpl';
import * as _ from 'lodash';
import { renderDescription, renderParams } from './ast';

export function buildMarkdown(json) {
  return json[0].members.instance
    .map(method => {
      const name = {
        templateName: 'name',
        data: method.name,
      };
      const example = {
        templateName: 'example',
        data: _.get(method, 'examples[0].description'),
      };
      const description = {
        templateName: 'description',
        data: renderDescription(method.description),
      };
      const params = {
        templateName: 'params',
        data: renderParams(method.params),
      };

      return [name, example, description, params].reduce((result, element) => {
        if (!element.data) {
          return result;
        }

        const output = render(element.templateName, { data: element.data });

        return `${result}${output}\n`;
      }, '');
    })
    .join('\n');
}
