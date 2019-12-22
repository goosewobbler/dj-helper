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

Current aspirations marked with `*`, these items can be seen as a TODO for the 4.0.0 release.

`Added`: Documentation for development `*`
`Added`: ADRs for all design decisions made `*`
`Added`: This changelog
`Added`: Webpack bundle analysis
`Added`: All missing typedefs for dependencies
`Added`: Concurrent linting of js and ts(x) files
`Changed`: Runs in Electron instead of a browser tab `*`
`Changed`: Using `eslint` instead of `tslint` for linting
`Changed`: Using `tailwindcss` invoked through `postcss` & `webpack` instead of Glamorous for styling `*`
`Changed`: Using `babel` instead of TSC for TypeScript transpilation
`Changed`: Using React Refresh instead of `react-hot-reload` for HMR `*`
`Changed`: Faster, more streamlined and modern build toolchain built around Webpack
`Changed`: More sensible directory structure
`Changed`: Better type sharing
`Changed`: No more lazy typing with `any`
`Changed`: Enabled strict type checking
`Fixed`: Memory leaks due to large number of circular dependencies
`Fixed`: ~3k linting errors
