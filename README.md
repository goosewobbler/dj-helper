# DJ Helper

This is an app for helping DJs to construct and manage lists of tracks whilst browsing online music sources such as BandCamp and BeatPort.

## Setup

[PNPM](https://pnpm.js.org) is the recommended package manager for use with this app, though others will likely work. You can install PNPM (https://pnpm.js.org/en/installation) and initialise the repository for development using the following commands:

```
curl -L https://raw.githubusercontent.com/pnpm/self-installer/master/install.js | node
pnpm i
```

## Development

Start the development server with `pnpm dev`. 

Hot Module Replacement (HMR) with React Fast Refresh and Webpack Dev Server is in use for rapid iteration on the `renderer` process, however when changing files running on the `main` process you will likely need to restart Electron.

### Tech Stack

The following technologies are used:

- **[Electron](https://electronjs.org)** (App Framework)
- **[TypeScript](https://www.typescriptlang.org)** (Core language)
- **[Babel](https://babeljs.io)** (Transpilation of TS => JS)
- **[Webpack](https://webpack.js.org)** (Development, Build and Deployment tooling)
- **[React](https://reactjs.org)** (UI)
- **[Redux Toolkit](https://redux-toolkit.js.org)** (State management)
- **[PostCSS](https://postcss.org)** (CSS tooling)
- **[TailwindCSS](https://tailwindcss.com)** (Styling)
- **[Jest](https://jestjs.io)** (Unit Testing)
- **[Testing Library](https://testing-library.com)** (Unit Testing)
- **[Prettier](https://prettier.io)** (Code formatting)
- **[ESLint](https://eslint.org)** (TS & JS linting)
- **[StyleLint](https://stylelint.io)** (CSS linting)
