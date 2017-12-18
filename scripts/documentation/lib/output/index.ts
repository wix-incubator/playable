import { render } from './tmpl';
import * as _ from 'lodash';
import { renderDescription, renderParams, renderReturns } from './ast';

export function buildMarkdown(json) {
  const playerClass = _.find(
    json,
    ({ name, kind }) => name === 'Player' && kind === 'class',
  );
  const interfaces = _.filter(json, ({ kind }) => kind === 'interface');

  return playerClass.members.instance
    .map(method => {
      const name = {
        templateName: 'name',
        data: method.name,
      };
      const example = {
        templateName: 'example',
        data: method.tags,
      };
      const description = {
        templateName: 'description',
        data: renderDescription(method.description),
      };
      const params = {
        templateName: 'params',
        data: renderParams(method.params),
      };
      const returns = {
        templateName: 'returns',
        data: renderReturns(method.returns, interfaces),
      };

      return [name, example, description, params, returns].reduce(
        (result, element) => {
          if (_.isEmpty(element.data)) {
            return result;
          }

          const output = render(element.templateName, { data: element.data });

          return `${result}${output}\n`;
        },
        '',
      );
    })
    .join('\n');
}
