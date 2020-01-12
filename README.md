# Morph Developer Console

MDC was the original Morph Developer GUI. This is intended to be the rebirth of MDC with the following improvements:

- Now an Electron app
- Documentation
- Modern tooling
- Much better use of TypeScript
- Better code quality
- Better performance

## Ordered TODO for release (\* denotes investigation required)

- ~Build tooling for dev (HMR, etc. for rapid iteration)~
- ~Replace Express API Server with file:/// and Webpack Dev Server~
- Put theming back in w/ TailwindCSS rules to replace removed Glamorous styles
- Put Jest tests back and unbitrot them
- Add new / update Jest tests for any changes to functionality
- Ensure all functionality works from inside Electron in Dev mode
- Build tooling for prod
- Ensure all functionality works from inside Electron in Prod mode
- Build tooling for deployment \*
- New auto-update feature \*
- Integration tests with Spectron \*
- Replace old class-based React Components with functions and hooks
- Remove use of non-null assertion!

## Install

It is recommended to use Yarn with Electron projects. You will need to explicitly set `cafile`, `cert` and `key` config values using `yarn config set`. Once yarn has these config values you can install using the following:

`yarn --registry https://npm.morph.int.tools.bbc.co.uk install`

## Development

Start the development server with `yarn dev`.

## Development Issues

Documentation of issues encountered during development.

### Tailwind.Macro Source Map Loader error

This was worked around by exempting `tailwind.macro` from the `source-map-loader` webpack rule config.

### NPM Invalid Config Warning

NPM throws an invalid config warning because the morph-cli depends on a (very old) local version of npm:

`npm WARN invalid config loglevel="notice"`

This can be fixed by upgrading morph-cli to use a later version, or by removing the local version from the tree. A script to perform the latter has been included in the package.json.

https://github.com/npm/npm/issues/16862#issuecomment-358112152
