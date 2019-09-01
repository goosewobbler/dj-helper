## Development Issues

Documentation of issues encountered during development.

### NPM Invalid Config Warning

NPM throws an invalid config warning because the morph-cli depends on a (very old) local version of npm:

`npm WARN invalid config loglevel="notice"`

This can be fixed by upgrading morph-cli to use a later version, or by removing the local version from the tree.  A script to perform the latter has been included in the package.json.

https://github.com/npm/npm/issues/16862#issuecomment-358112152