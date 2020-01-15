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
- ~Put theming back in w/ TailwindCSS approach~
- Replace all removed Glamorous styles with Tailwind classes
- Put Jest tests back and unbitrot them
- Add new / update Jest tests for any changes to functionality
- Ensure all functionality works from inside Electron in Dev mode
- Finish off build tooling for production
- Ensure all functionality works from inside Electron in Production mode
- Separate building DLL dependencies to speed up build time using Webpack DLL plugin
- Integration tests with Spectron \*
- Build tooling for automated deployment using Github Releases
- New auto-update feature using electron-updater
- Replace old class-based React Components with functions and hooks
- Remove use of non-null assertion! (tech debt from enabling strict null checking)
- Remove any remaining use of `any`
- Clean up any remaining ESLint errors 
- Add Ceefax mode back in

## Install

It is recommended to use Yarn with Electron projects. You will need to explicitly set `cafile`, `cert` and `key` config values using `yarn config set`. Once yarn has these config values you can install using the following:

`yarn --registry https://npm.morph.int.tools.bbc.co.uk install`

## Development

Start the development server with `yarn dev`.



