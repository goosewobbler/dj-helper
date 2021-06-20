Yarn was originally chosen as the package manager for this project based on its use in the original MDC, and online sources proclaiming it to be the better option (compared to NPM) when starting an Electron project. However a number of shortcomings of Yarn have become obvious and the release of 2.x has done the opposite of improving things.

## Issues with Yarn

1. Long-running bug where --upgrade-interactive doesn't save upgraded versions to the package.json (see https://github.com/yarnpkg/yarn/issues/7181)
2. Update to 2.x is non-trivial and awkward
3. Ongoing lack of support for SSL in 2.x (see https://github.com/yarnpkg/berry/issues/798)

Additionally, whilst trialling PNPM a number of benefits were observed:

## Benefits of switching to PNPM

1. Significant reduction in install / build time
2. More strict and saves a lot of disk space
3. Much reduced version confusion compared to Yarn berry vs. legacy
4. Closer to NPM's syntax than Yarn, but includes equivalents for Yarn features like script shortcuts and `--upgrade-interactive`
5. Works with all existing .npmrc settings (including certs) out of the box
6. When updating dependencies `pnpm up` just works, unlike the Yarn equivalent
7. Development activity about as busy as Yarn's, but with more frequent releases
8. Gaining traction in community
