if (!process.env.IS_BUILD_AGENT) {
  console.log(
    "Package will not be published because we're not running in a CI build agent",
  );
  return process.exit(0);
}

const util = require('util');
const path = require('path');
const semver = require('semver');
const exec = util.promisify(require('child_process').exec);
const writeFile = util.promisify(require('fs').writeFile);

const packageJSONPath = path.resolve(__dirname, '..', 'package.json');
const packageJSON = require(packageJSONPath);

const ZERO_VERSION = '0.0.0';

function getPublishedVersion() {
  return exec(
    'npm view playable version --registry=https://registry.npmjs.org/',
  ).catch(e => {
    if (e.stderr.startsWith('npm ERR! code E404')) {
      console.log('ERROR: package not found. Possibly not published yet', e);
      return ZERO_VERSION;
    }

    console.log('ERROR: Unable to get published version from npmjs.org', e);
  });
}

function shouldPublish(publishedVersion, packageJSONVersion) {
  return (
    publishedVersion === ZERO_VERSION ||
    (!!publishedVersion && semver.gt(packageJSONVersion, publishedVersion))
  );
}

writeFile(
  packageJSONPath,
  // NOTE: use `private: true` to prevent publish to npm
  JSON.stringify(Object.assign({}, packageJSON, { private: true })),
)
  .then(getPublishedVersion)
  .then(publishedVersion => {
    if (shouldPublish(publishedVersion, packageJSON.version)) {
      return writeFile(packageJSONPath, JSON.stringify(packageJSON)).then(
        () => {
          if (publishedVersion !== ZERO_VERSION) {
            console.log(
              `Version set in package.json ${
                packageJSON.version
              } is newer than published ${publishedVersion}`,
            );
          }

          console.log(`Package will be published`);
        },
      );
    } else {
      console.log(`Package will not be published`);
      if (publishedVersion) {
        console.log(
          `version ${
            packageJSON.version
          } set in package.json is already published`,
        );
      }
    }
  })
  .catch(error => {
    console.error('ERROR: Unable to publish', error);
    process.exit(1);
  });
