A common method of improving compile time in Weback is to use the [DllPlugin](https://webpack.js.org/plugins/dll-plugin/) to precompile a set of dependencies. This pattern can be observed in the Electron React Boilerplate project, unfortunately in addition to cutting compile times it also substantially increases the complexity of the webpack configs.

A simpler method of splitting was found in potential use of the [AutoDllPlugin](https://github.com/asfktz/autodll-webpack-plugin), however this will be made obsolete by Webpack 5's new caching (currently in beta). Although Dll splitting itself will not be going away (see https://github.com/webpack/webpack/issues/6527) and may still find use in MDC, the decision was made to:

(a) focus on other mechanisms for improving compile time - such as the [HardSourceWebpackPlugin](https://github.com/mzgoddard/hard-source-webpack-plugin)
(b) reassess these mechanisms once Webpack 5 has been released.
