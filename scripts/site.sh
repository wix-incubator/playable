#!/usr/bin/env bash

DIST_PATH=./dist
SITE_PATH=./site
SITE_DIST_PATH=$SITE_PATH/build

function preparePlayerDocSiteSource {
  cp ./API.md $SITE_PATH/source/includes/_API.md
}

function installPlayerDocSite {
  cd $SITE_PATH && bundle install && cd -
}

function buildPlayerDocSite {
  preparePlayerDocSiteSource

  cd $SITE_PATH && bundle exec middleman build --clean && cd -
}

function servePlayerDocSite {
  preparePlayerDocSiteSource

  cd $SITE_PATH && bundle exec middleman server && cd -
}

function extendPlayerDicSiteWithStatic {
  npm run build

  # copy player statics to site dist directory
  cp -rf $DIST_PATH/statics/ $SITE_DIST_PATH/statics/
}

function deployPlayerDocSite {
  ./node_modules/.bin/gh-pages -d $SITE_DIST_PATH
}

if [[ $1 = --install ]]; then
  installPlayerDocSite
elif [[ $1 = --serve ]]; then
  servePlayerDocSite
elif [[ $1 = --deploy ]]; then
  buildPlayerDocSite
  extendPlayerDicSiteWithStatic
  deployPlayerDocSite
else
  buildPlayerDocSite
fi
