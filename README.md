# Morph Developer Console

MDC was the original Morph Developer GUI. This is intended to be the rebirth of MDC with the following improvements:

- Now an Electron app
- Documentation for development, build and deployment
- Modern tooling
- Much improved use of TypeScript
- Better code quality
- Better performance

## Roughly ordered TODO for release (\* denotes requirement for boilerplate repo)

- ~Build tooling for dev (HMR, etc. for rapid iteration)~
- ~Replace Express API Server with file:/// and Webpack Dev Server~
- ~Put theming back in w/ TailwindCSS approach~
- ~Move webpack configs into own dir~
- ~Replace all removed Glamorous styles with Tailwind classes~
- Fix styling of module details panel - IN PROGRESS
- Update unit tests with React Testing Library - IN PROGRESS
- Add new / update unit tests for any changes to functionality
- Ensure all functionality works from inside Electron in Dev mode
- Finish off build tooling for production
- Ensure all functionality works from inside Electron in Production mode
- Improvements in compilation time
  - ~Separate building DLL dependencies to speed up build time using Webpack DLL plugin~
  - ~Use `HardSourceWebpackPlugin` to implement caching ahead of the Webpack 5 release~
  - ~Make `BundleAnalyzerPlugin` run for Production only~
- Build tooling for automated deployment using Github Releases
- New auto-update feature using electron-updater
- Write comprehensive development docs
- Port old MDC user docs

## Nice to Have / Post Release

- Switch to use Redux Toolkit and update Redux usage for the Redux Style Guide
- Integration tests with Spectron
- Replace old class-based React Components with functions and hooks
- Upgrade Webpack to v5
- Replace `react-hot-loader` with React Refresh (likely dependent on Webpack 5)
- Remove use of non-null assertion! (tech debt from enabling strict null checking)
- Remove remaining use of `any`
- Clean up remaining ESLint errors
- Enable pre-commit hooks using Husky
- Add Ceefax mode back in

## Install

It is recommended to use Yarn with Electron projects. You will need to explicitly set `cafile`, `cert` and `key` config values using `yarn config set`. Once yarn has these config values you can install using the following:

`yarn --registry https://npm.morph.int.tools.bbc.co.uk install`

## Development

Start the development server with `yarn dev`.

### Tech Stack

The following technologies are used:

- **[Electron](https://electronjs.org)** (App Framework)
- **[TypeScript](https://www.typescriptlang.org)** (Core language)
- **[Babel](https://babeljs.io)** (Transpilation of TS => JS)
- **[Webpack](https://webpack.js.org)** (Development, Build and Deployment tooling)
- **[React](https://reactjs.org)** (UI)
- **[Redux](https://redux.js.org)** (State management)
- **[PostCSS](https://postcss.org)** (CSS tooling)
- **[TailwindCSS](https://tailwindcss.com)** (Styling & Themes)
- **[Express](https://expressjs.com)** (Component server)
- **[Socket.IO](https://socket.io)** (Component <=> App communication)
- **[Jest](https://jestjs.io)** (Unit Testing)
- **[Enzyme](https://airbnb.io/enzyme)** (Unit Testing)
- **[Morph CLI](https://github.com/bbc/morph-cli)** (Component tooling, Morph interface)
- **[Chas](https://github.com/bbc/chas)** (Component rendering)
- **[Prettier](https://prettier.io)** (Code formatting)
- **[ESLint](https://eslint.org)** (TS & JS linting)
- **[StyleLint](https://stylelint.io)** (CSS linting)

### Useful Links

- https://basarat.gitbook.io/typescript/
- https://github.com/electron-react-boilerplate/electron-react-boilerplate
- https://github.com/sindresorhus/awesome-electron
- https://github.com/enaqx/awesome-react
- https://github.com/webpack-contrib/awesome-webpack
- https://github.com/aniftyco/awesome-tailwindcss
- https://www.postcss.parts/
