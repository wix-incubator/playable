import * as fs from 'fs';
import { buildDocumentation } from './lib';
import { buildMarkdown } from './lib/output';

// NOTE: ignore first 2 arguments (ts-node and path of this file)
const [playerApiGlob, outputPath] = process.argv.slice(2);

buildDocumentation(playerApiGlob)
  .then(output => {
    const markdown = buildMarkdown(JSON.parse(output));

    if (!outputPath) {
      process.stdout.write(markdown);
    } else {
      fs.writeFileSync(outputPath, markdown);
    }
  })
  .catch(err => {
    console.error(err); // tslint:disable-line

    process.exit(1);
  });
