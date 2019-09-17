# Contributing to Playable

## Commit Message Guidelines

We use [conventionalcommits](https://conventionalcommits.org) to format our commit messages.  This leads to **more
readable messages** that are easy to follow when looking through the **project history**. But also,
we use the git commit messages to generate the [Playable release notes](https://github.com/wix/playable/releases).

Each commit message consists of a **header**, a **body** and a **footer**.  The header has a special
format that includes a **type**, a **scope** and a **subject**:

```
<type>[optional scope]: <description>

[optional body]

[optional footer]
```

More info about message format and list of types could be found [here](https://conventionalcommits.org)

### Scope
The scope should be the name of affected playable part (readable for the person reading the changelog generated from commit messages).

The following is the list of supported scopes:

* **core**
* **adapters**
* **constants**
* **modules/NAME_OF_MODULE_HERE**
* **modules/ui/NAME_OF_MODULE_HERE**


## Run playground
- `npm i`
- `npm run start`
- open <https://localhost:5000>

## Release New Version

To release new version:
- checkout latest master version:
  `git checkout master` & `git pull`
- run [version script](https://docs.npmjs.com/cli/version):
  `npm version [major | minor | patch]`
- push master branch and tags:
  `git push origin master` & `git push origin [NEW_VERSION_TAG]`
- draft a new [release on github](https://github.com/wix/playable/releases) with changelog from `npm version` command
- after CI released new package, publish [release on github](https://github.com/wix/playable/releases)
- publish new documentation version  `npm run documentation:site:deploy`
