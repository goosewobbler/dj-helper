# Architecture

This application is comprised of the following root directory structure:

```
.vscode/
dist/
docs/
src/
static/
test/
types/
webpack/
...configuration files
```

#### .vscode/

A configuration directory for the VSCode editor.

#### dist/

This directory is (re)created at build time for the app to load - all compiled files and everything the app needs to run ends up in here.

#### docs/

The home for documentation pages such as this one.

#### src/

All files that comprise the application source. The source is split up into the following:

`common/` - files to be shared across main / renderer processes or which are used by multiple features
`css/` - all functionality for building stylesheets and accessing dynamic styles
`features/` - Redux slices and React components associated with them
`main/` - Electron application logic for the main process
`renderer/` - Electron application logic for the renderer process
`index.ejs` - Root HTML template

#### static/

Static files such as fonts and images.

#### test/

Contains [Jest](https://jestjs.io/) unit tests and [Spectron](https://electronjs.org/spectron) integration tests.

#### types/

Contains custom type definitions.

#### webpack/

The webpack build configuration, split across two files for each process and one shared rules file. Babel is also configured here.

#### ...configuration files

The rest of the things in the root directory are configuration files for ESLint, Git, Prettier, StyleLint, Jest, PNPM, PostCSS, TailwindCSS, and TypeScript.
