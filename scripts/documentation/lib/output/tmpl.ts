import { readFileSync } from 'fs';
import * as path from 'path';
import * as ejs from 'ejs';

export function render(templateName, options) {
  // TODO: add cache for templates and read files async
  const template = readFileSync(
    path.join(__dirname, `/templates/${templateName}.md`),
    {
      encoding: 'utf8',
    },
  );

  return (
    ejs
      .render(template, options)
      // trip line break at the beginning
      .replace(/^\n+/g, '')
      // make sure that you have only one line break at the end
      .replace(/\n+$/g, '\n')
      // replace more then 2 line break for 2
      .replace(/[\n]{2,}/g, '\n\n')
  );
}
