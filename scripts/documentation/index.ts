import * as fs from 'fs';
import { buildDocumentation } from './lib';

// NOTE: ignore first 2 arguments (ts-node and path of this file)
const [playerApiGlob, outputPath] = process.argv.slice(2);

buildDocumentation(playerApiGlob)
  .then(output => {
    if (!outputPath) {
      process.stdout.write(output);
    } else {
      fs.writeFileSync(outputPath, output);
    }
  })
  .catch(err => {
    console.error(err);

    process.exit(1);
  });
