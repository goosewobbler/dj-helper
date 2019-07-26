"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var runNpm_1 = require("../helpers/runNpm");
var packageHash_1 = require("./helpers/packageHash");
var ComponentActions = function (system, routing, config, componentPath, name, getPort, log, getOther, getUseCache, onReload) {
    var stopRunning;
    var readPackage = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, system.file.readFile(path_1.join(componentPath, 'package.json'))];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        }
    }); }); };
    var hasBuildScript = function () { return __awaiter(_this, void 0, void 0, function () {
        var packageContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readPackage()];
                case 1:
                    packageContents = _a.sent();
                    return [2 /*return*/, packageContents.scripts && packageContents.scripts.build];
            }
        });
    }); };
    var hasBower = function () { return system.file.exists(path_1.join(componentPath, 'bower.json')); };
    var hasGrunt = function () { return system.file.exists(path_1.join(componentPath, 'Gruntfile.js')); };
    var calculatePackageHash = function () { return __awaiter(_this, void 0, void 0, function () { var _a; return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = packageHash_1.default;
                return [4 /*yield*/, readPackage()];
            case 1: return [2 /*return*/, _a.apply(void 0, [_b.sent()])];
        }
    }); }); };
    var updatePackageHash = function () { return __awaiter(_this, void 0, void 0, function () {
        var hash, mdcFile;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, calculatePackageHash()];
                case 1:
                    hash = _a.sent();
                    mdcFile = JSON.stringify({ hash: hash });
                    return [4 /*yield*/, system.file.writeFile(path_1.join(componentPath, 'node_modules', '.mdc.json'), mdcFile)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getPackageHash = function () { return __awaiter(_this, void 0, void 0, function () {
        var packageHashContents, _a, _b, ex_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    _b = (_a = JSON).parse;
                    return [4 /*yield*/, system.file.readFile(path_1.join(componentPath, 'node_modules', '.mdc.json'))];
                case 1:
                    packageHashContents = _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/, packageHashContents.hash];
                case 2:
                    ex_1 = _c.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/, null];
            }
        });
    }); };
    var buildAll = function () { return __awaiter(_this, void 0, void 0, function () {
        var command, shortName, buildLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, hasBuildScript()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 2];
                    command = 'npm run build';
                    shortName = 'npm run build';
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, hasGrunt()];
                case 3:
                    if (_a.sent()) {
                        command = path_1.join(__dirname, '../../../node_modules/.bin/grunt build');
                        shortName = 'grunt build';
                    }
                    _a.label = 4;
                case 4:
                    if (!command) return [3 /*break*/, 6];
                    log("Running " + shortName + "...");
                    buildLog = function (message) { return log("[" + shortName + "] " + message); };
                    return [4 /*yield*/, system.process.runToCompletion(componentPath, command, buildLog, buildLog)];
                case 5:
                    _a.sent();
                    log('Built.');
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    }); };
    var buildSass = function () { return __awaiter(_this, void 0, void 0, function () {
        var command, buildLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    command = path_1.join(__dirname, '../../../node_modules/.bin/grunt sass');
                    log('Running grunt sass...');
                    buildLog = function (message) { return log("[grunt sass] " + message); };
                    return [4 /*yield*/, system.process.runToCompletion(componentPath, command, buildLog, buildLog)];
                case 1:
                    _a.sent();
                    log('Built.');
                    return [2 /*return*/];
            }
        });
    }); };
    var install = function () { return __awaiter(_this, void 0, void 0, function () {
        var installLog, bowerLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log('Running npm install...');
                    installLog = function (message) { return log("[npm install] " + message); };
                    return [4 /*yield*/, runNpm_1.default(system, componentPath, ['install'], installLog, installLog)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updatePackageHash()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, hasBower()];
                case 3:
                    if (!_a.sent()) return [3 /*break*/, 5];
                    bowerLog = function (message) { return log("[bower install] " + message); };
                    return [4 /*yield*/, system.process.runToCompletion(componentPath, 'node node_modules/bower/bin/bower install', bowerLog, bowerLog)];
                case 4:
                    _a.sent();
                    _a.label = 5;
                case 5:
                    log('Installed.');
                    return [2 /*return*/];
            }
        });
    }); };
    var link = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        var otherDirectoryName, otherPath, nodeModulePath, oldNodeModulePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("Linking " + dependency + "...");
                    otherDirectoryName = getOther(dependency).getDirectoryName();
                    otherPath = path_1.join(componentPath, '..', otherDirectoryName);
                    nodeModulePath = path_1.join(componentPath, 'node_modules', dependency);
                    oldNodeModulePath = nodeModulePath + ".old";
                    return [4 /*yield*/, system.file.moveDirectory(nodeModulePath, oldNodeModulePath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, system.file.createSymlink(otherPath, nodeModulePath)];
                case 2:
                    _a.sent();
                    log("Linked " + dependency + ".");
                    return [2 /*return*/];
            }
        });
    }); };
    var makeOtherLinkable = function (otherName) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
        return [2 /*return*/, getOther(otherName).makeLinkable()];
    }); }); };
    var needsInstall = function () { return __awaiter(_this, void 0, void 0, function () {
        var oldPackageHash, newPackageHash;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (config.getValue('installOnStart') === false) {
                        return [2 /*return*/, false];
                    }
                    log('Installing...');
                    return [4 /*yield*/, getPackageHash()];
                case 1:
                    oldPackageHash = _a.sent();
                    return [4 /*yield*/, calculatePackageHash()];
                case 2:
                    newPackageHash = _a.sent();
                    if (oldPackageHash !== newPackageHash) {
                        log('Dependencies need installing.');
                        return [2 /*return*/, true];
                    }
                    log('Dependencies are up to date.');
                    return [2 /*return*/, false];
            }
        });
    }); };
    var run = function () { return __awaiter(_this, void 0, void 0, function () {
        var useCache, command, stopProcess;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    useCache = getUseCache();
                    log('Starting...');
                    command = path_1.join(__dirname, "../../../node_modules/morph-cli/bin/morph.js develop" + (useCache ? ' --cache' : '') + " --port " + getPort());
                    return [4 /*yield*/, system.process.runUntilStopped(componentPath, command, log, log)];
                case 1:
                    stopProcess = _a.sent();
                    onReload();
                    return [4 /*yield*/, routing.updateRoute(name, getPort())];
                case 2:
                    _a.sent();
                    stopRunning = function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0: return [4 /*yield*/, routing.updateRoute(name, null)];
                                case 1:
                                    _a.sent();
                                    return [4 /*yield*/, stopProcess()];
                                case 2:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    log(useCache ? 'Running with cache enabled.' : 'Running.');
                    return [2 /*return*/];
            }
        });
    }); };
    var stop = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!stopRunning) return [3 /*break*/, 2];
                    log('Stopping...');
                    return [4 /*yield*/, stopRunning()];
                case 1:
                    _a.sent();
                    log('Stopped.');
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    }); };
    var uninstall = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log('Deleting node_modules.');
                    return [4 /*yield*/, system.file.deleteDirectory(path_1.join(componentPath, 'node_modules'))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var unlink = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        var nodeModulePath, oldNodeModulePath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log("Unlinking " + dependency + "...");
                    nodeModulePath = path_1.join(componentPath, 'node_modules', dependency);
                    oldNodeModulePath = nodeModulePath + ".old";
                    return [4 /*yield*/, system.file.removeSymlink(nodeModulePath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, system.file.moveDirectory(oldNodeModulePath, nodeModulePath)];
                case 2:
                    _a.sent();
                    log("Unlinked " + dependency + ".");
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        buildAll: buildAll,
        buildSass: buildSass,
        install: install,
        link: link,
        makeOtherLinkable: makeOtherLinkable,
        needsInstall: needsInstall,
        run: run,
        stop: stop,
        uninstall: uninstall,
        unlink: unlink,
    };
};
exports.default = ComponentActions;
//# sourceMappingURL=ComponentActions.js.map