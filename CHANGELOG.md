<h1 align="center">Morph Developer Console Changelog</h1>
<p align="center">
    <a href="https://npm.morph.int.tools.bbc.co.uk/morph-developer-console" target="_blank">
        <img src="https://img.shields.io/badge/morph-npm-2C82C9.svg?style=flat-square">
    </a>
</p>

Every time a change is made and the module version increased, we document why and what the change was here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

TL;DR

Please follow the format of existing entries, the types of change are:

`Added` for new features.

`Changed` for changes in existing functionality.

`Deprecated` for soon-to-be removed features.

`Removed` for now removed features.

`Fixed` for any bug fixes.

`Security` in case of vulnerabilities.

## [4.0.0] - NO TICKET

`Added`: Documentation for development
`Added`: ADRs for design decisions made
`Added`: This changelog
`Added`: Webpack bundle analysis
`Added`: Missing typedefs for some dependencies
`Added`: Concurrent linting of js and ts(x) files
`Changed`: Runs in Electron instead of a browser tab
`Changed`: Using ESLint instead of TSLint for linting
`Changed`: Using TailwindCSS / PostCSS / Webpack instead of Glamorous for styling
`Changed`: Using Babel instead of TSC for TypeScript transpilation
`Changed`: Faster, more streamlined and modern build toolchain built around Webpack
`Changed`: More sensible directory structure
`Changed`: Better type sharing
`Changed`: No more lazy typing with `any`
`Changed`: Enabled strict type checking
`Fixed`: Memory leaks due to large number of circular dependencies
`Fixed`: ~3k linting errors
