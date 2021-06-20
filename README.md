# Morph Developer Console

[Morph Developer Console](https://github.com/bbc/morph-developer-console) was the original Morph Developer GUI. This is intended to be the rebirth of MDC with the following improvements:

- Now an Electron app
- Documentation for development, build and deployment
- Modern tooling
- Much improved use of TypeScript
- Better code quality
- Better performance

## Install

MDC Electron should run on Node 10 at a minimum as per the previous MDC, however the current version of Node in Electron (as of v9) is 12 so if you have any problems you might want to upgrade to that. The `.nvmrc` file in the root of the project should ensure the correct version is used when running MDC if you use a switching mechanism, e.g. for ZSH:

https://github.com/nvm-sh/nvm#zsh \
https://github.com/lukechilds/zsh-nvm

[PNPM](https://pnpm.js.org) is the recommended package manager for use with MDC. You can install PNPM (https://pnpm.js.org/en/installation) and initialise the repository for development using the following commands:

```
curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node
pnpm init
```

## Development

Start the development server with `pnpm dev`. Hot Module Replacement (HMR) with React Dev Server is in use for rapid iteration on the `renderer` process, however when changing files running on the `main` process you will likely need to restart Electron.

## Tasks / issues for release

https://github.com/bbc/mdc-electron/projects/1

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
- **[Testing Library](https://testing-library.com)** (Unit Testing)
- **[Morph CLI](https://github.com/bbc/morph-cli)** (Component tooling, Morph interface)
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
