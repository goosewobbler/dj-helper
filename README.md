# DJ Helper

This is an app for helping DJs to construct and manage lists of tracks whilst browsing online music sources such as Bandcamp and Beatport. More generalised digital music curation features may be added in the future, focussing on ownership / downloadable content over streaming.

## Rationale

Most music apps these days are geared around streaming, with DJs and digital record collectors being overlooked. Existing apps serving this demographic broadly fall into three categories:

* Local Music Management / Playback (iTunes, Clementine, etc.)
* Online Music Acquisition (Bandcamp, Beatport, etc.)
* DJ Software (Rekordbox, Traktor, etc.)

The problem is that the places for acquiring new digital music are online and totally separated from the places where the downloaded tracks end up.  Having to cross-reference different offline and online lists with all the different music platforms and manage the state of each track (non-triaged / triaged / listened / bought / downloaded / in library) is tedious.  A typical workflow for building a setlist looks like this:

1. Listen to streamed tracks
2  Copy the artist & title of each interesting track into a note app
3  When streamed from a platform allowing downloads, add track to online wishlist or cart
4. Check that each track is not already in your local library, or an online library of a different platform 
5. Repeat 1-4 until enough tracks, triage note app list
6. Triage online wishlists / carts, ensure synchronised with note app list
7. Pay for desired new tracks on download platforms
8. Download tracks
9. Import tracks into offline library, update metadata where necessary
10. Recreate list from note app in DJ software by searching your library
11. Start mixing, triage

This can be made a lot easier if the gap between local library and online download platform can be reduced.

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
