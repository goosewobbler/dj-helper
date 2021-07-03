# Design Decisions

## Babel over TSC

We use `babel` to compile TypeScript instead of the TypeScript compiler `tsc`. Although there are also performance reasons for using Babel, all HMR (hot module replacement) solutions for Electron / React currently use Babel.

## Dev Dependencies

We use DevDependencies for all dependencies unless it is obvious that a given dependency is required for the running (not build or dev) of the application.

https://github.com/webpack/webpack/issues/520#issuecomment-331689542

## No Default Export

We use named over default exports to improve discoverability, maintainability and intellisense functionality.

https://basarat.gitbook.io/typescript/main-1/defaultisbad

## PNPM over Yarn

Yarn was originally chosen as the package manager for this project based on online sources proclaiming it to be the better option (compared to NPM) when starting an Electron project. However upon trialling PNPM a number of benefits were observed:

### Benefits of switching to PNPM

1. Reduction in install / build time
2. More strict and saves a lot of disk space
3. Reduced version confusion compared to Yarn berry vs. legacy
4. Closer to NPM's syntax than Yarn, but includes equivalents for Yarn features like script shortcuts and `--upgrade-interactive`
5. Development activity about as busy as Yarn's, but with more frequent releases
6. Gaining traction in community
