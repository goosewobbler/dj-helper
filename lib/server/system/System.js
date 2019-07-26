"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FileSystem_1 = require("./FileSystem");
var GitSystem_1 = require("./GitSystem");
var MorphSystem_1 = require("./MorphSystem");
var NetworkSystem_1 = require("./NetworkSystem");
var ProcessSystem_1 = require("./ProcessSystem");
var System = {
    file: FileSystem_1.default,
    git: GitSystem_1.default,
    morph: MorphSystem_1.default,
    network: NetworkSystem_1.default,
    process: ProcessSystem_1.default,
};
exports.default = System;
//# sourceMappingURL=System.js.map