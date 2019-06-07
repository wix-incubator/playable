const util = require('util');
const path = require('path');
const fs = require('fs');
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const packageJSONPath = path.resolve(__dirname, '..', 'package.json');
const packageJSON = require(packageJSONPath);

// NOTE: pattern for string like 'https://unpkg.com/playable@1.0.0/dist/statics/playable.bundle.min.js'
const UNPKG_URL_REPLACE_PATTERN = /(https?:\/\/unpkg.com)\/([\w-]+)@(\d+\.\d+\.\d+)\/(.+)/gi;

function replaceUnpkgVersion(markdownString, version) {
  return markdownString.replace(
    UNPKG_URL_REPLACE_PATTERN,
    `$1/$2@${version}/$4`,
  );
}

function updateVersionInMarkdown(filePath) {
  return readFile(filePath).then(content =>
    writeFile(
      filePath,
      replaceUnpkgVersion(content.toString(), packageJSON.version),
    ),
  );
}

const FILES_TO_UPDATE = [
  path.resolve(__dirname, '../README.md'),
  path.resolve(__dirname, '../docs/index.md'),
  path.resolve(__dirname, '../docs/site.yml'),
];

Promise.all(
  FILES_TO_UPDATE.map(filePath => updateVersionInMarkdown(filePath)),
).catch(error => {
  console.error('ERROR: Unable to update version in `md` files', error);
  process.exit(1);
});
