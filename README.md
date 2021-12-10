[![Libraries.io dependencies status](https://img.shields.io/librariesio/release/github/goosewobbler/dj-helper)](https://libraries.io/github/goosewobbler/dj-helper) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=goosewobbler_dj-helper&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=goosewobbler_dj-helper) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=goosewobbler_dj-helper&metric=security_rating)](https://sonarcloud.io/dashboard?id=goosewobbler_dj-helper) [![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=goosewobbler_dj-helper&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=goosewobbler_dj-helper) [![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=goosewobbler_dj-helper&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=goosewobbler_dj-helper) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=goosewobbler_dj-helper&metric=alert_status)](https://sonarcloud.io/dashboard?id=goosewobbler_dj-helper)  
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

# DJ Helper

**🚧 Currently pre-alpha, MVP / functional prototype will be v0.1 🚧**

This is an app for helping DJs to construct and manage lists of tracks whilst browsing online music sources such as Bandcamp and Beatport. More generalised digital music curation features may be added in the future, focussing on ownership / downloadable content over streaming.

## Rationale

Most music apps these days are geared around streaming, with DJs and digital record collectors being overlooked. Existing apps serving this demographic broadly fall into three categories:

- Local Music Management / Playback (iTunes, Clementine, etc.)
- Online Music Acquisition (Bandcamp, Beatport, etc.)
- DJ Software (Rekordbox, Traktor, etc.)

The problem is that the places for acquiring new digital music are online and totally separated from the places where the downloaded tracks end up. Having to cross-reference different offline and online lists with all the different music platforms and manage the state of each track (non-triaged / triaged / listened / bought / downloaded / in library) is tedious.

This problem will be made a lot easier if the gaps between local library, DJ software and online streaming / download platforms can be bridged in some way.

## Setup

[PNPM](https://pnpm.io) is the recommended package manager for use with this app, though others will likely work. The following command will initialise the repository for development:

```
pnpm i
```

## Development

Start the development server:

```
pnpm dev
```

Hot Module Replacement (HMR) with React Fast Refresh and Webpack Dev Server is in use for rapid iteration on both `renderer` and `main` processes.

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
