"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hash = require("node-object-hash");
var hasher = hash({ sort: true }).hash;
var packageHash = function (packageContents) {
    var contentsSubset = {
        dependencies: packageContents.dependencies,
        devDependencies: packageContents.devDependencies,
        version: packageContents.version,
    };
    return hasher(contentsSubset);
};
exports.default = packageHash;
//# sourceMappingURL=packageHash.js.map