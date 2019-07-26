"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var fp_1 = require("lodash/fp");
var path_1 = require("path");
var semver = require("semver");
var ComponentActions_1 = require("./ComponentActions");
var ComponentStateMachine_1 = require("./ComponentStateMachine");
var DefaultTypeOverrides_1 = require("./DefaultTypeOverrides");
var editor_1 = require("./helpers/editor");
var request_1 = require("./helpers/request");
var ComponentType_1 = require("./types/ComponentType");
var Component = function (system, routing, config, state, name, directoryName, componentPath, acquirePort, onUpdate, onReload, getOther) {
    var port = null;
    var pagePort = null;
    var promoting = null;
    var promotionFailure = null;
    var dependencies = [];
    var url = null;
    var linking = [];
    var versions = {
        int: null,
        live: null,
        local: null,
        test: null,
    };
    var updated = function () { return onUpdate(name); };
    var getDisplayName = function () { return directoryName; };
    var log = function (message) { return system.process.log("[" + getDisplayName() + "] " + message); };
    var getPackagePath = function () { return path_1.join(componentPath, 'package.json'); };
    var readPackage = function () { return __awaiter(_this, void 0, void 0, function () { var _a, _b; return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _b = (_a = JSON).parse;
                return [4 /*yield*/, system.file.readFile(getPackagePath())];
            case 1: return [2 /*return*/, _b.apply(_a, [_c.sent()])];
        }
    }); }); };
    var getName = function () { return name; };
    var getDirectoryName = function () { return directoryName; };
    var getPort = function () {
        if (port === null) {
            port = acquirePort();
        }
        return port;
    };
    var setPagePort = function (newPagePort) {
        pagePort = newPagePort;
    };
    var getType = function () { return __awaiter(_this, void 0, void 0, function () {
        var typeOverride, packageContents, packageDependencies;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    typeOverride = DefaultTypeOverrides_1.default(name) || config.getValue("typeOverrides." + name);
                    if (typeOverride) {
                        switch (typeOverride) {
                            case 'data':
                                return [2 /*return*/, ComponentType_1.default.Data];
                            case 'view':
                                return [2 /*return*/, ComponentType_1.default.View];
                            case 'page':
                                return [2 /*return*/, ComponentType_1.default.Page];
                        }
                    }
                    return [4 /*yield*/, readPackage()];
                case 1:
                    packageContents = _a.sent();
                    packageDependencies = packageContents.dependencies || {};
                    if (packageDependencies['bbc-morph-page-assembler']) {
                        return [2 /*return*/, ComponentType_1.default.Page];
                    }
                    else if (packageDependencies.react) {
                        return [2 /*return*/, ComponentType_1.default.View];
                    }
                    return [2 /*return*/, ComponentType_1.default.Data];
            }
        });
    }); };
    var updateURL = function () { return __awaiter(_this, void 0, void 0, function () {
        var localhost, type;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    localhost = config.getValue('localhost') || 'localhost';
                    return [4 /*yield*/, getType()];
                case 1:
                    type = _a.sent();
                    if (type === ComponentType_1.default.Page) {
                        if (pagePort) {
                            url = "http://" + localhost + ":" + pagePort;
                        }
                    }
                    else if (type === ComponentType_1.default.View) {
                        url = "http://" + localhost + ":4000/view/" + name;
                    }
                    else {
                        url = "http://" + localhost + ":4000/data/" + name;
                    }
                    return [2 /*return*/];
            }
        });
    }); };
    var getURL = function () { return url; };
    var getDependency = function (dependencyName) {
        var dependency = dependencies.find(function (d) { return d.name === dependencyName; });
        return (dependency || {
            has: null,
            latest: null,
            version: null,
        });
    };
    var updateDependencies = function () { return __awaiter(_this, void 0, void 0, function () {
        var packageContents, updateLazy, shrinkwrapped;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readPackage()];
                case 1:
                    packageContents = _a.sent();
                    return [4 /*yield*/, Promise.all(Object.keys(packageContents.dependencies || {})
                            .filter(fp_1.startsWith('bbc-morph-'))
                            .map(function (dependencyName) { return __awaiter(_this, void 0, void 0, function () {
                            var _a, _b;
                            return __generator(this, function (_c) {
                                switch (_c.label) {
                                    case 0:
                                        _a = [{}, getDependency(dependencyName)];
                                        _b = { displayName: dependencyName.substr(10) };
                                        return [4 /*yield*/, system.file.symbolicLinkExists(path_1.join(componentPath, 'node_modules', dependencyName))];
                                    case 1: return [2 /*return*/, __assign.apply(void 0, _a.concat([(_b.linked = _c.sent(), _b.name = dependencyName, _b)]))];
                                }
                            });
                        }); }))];
                case 2:
                    dependencies = _a.sent();
                    return [4 /*yield*/, updated()];
                case 3:
                    _a.sent();
                    updateLazy = Promise.all(dependencies.map(function (dependency) { return __awaiter(_this, void 0, void 0, function () {
                        var other, version, latest, outdated;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    other = getOther(dependency.name);
                                    version = packageContents.dependencies[dependency.name];
                                    latest = null;
                                    outdated = false;
                                    if (!other) return [3 /*break*/, 2];
                                    return [4 /*yield*/, other.getLatestVersion()];
                                case 1:
                                    latest = _a.sent();
                                    outdated = !semver.satisfies(latest, version);
                                    _a.label = 2;
                                case 2:
                                    dependency.version = version;
                                    dependency.latest = latest;
                                    dependency.outdated = outdated;
                                    return [4 /*yield*/, updated()];
                                case 3:
                                    _a.sent();
                                    return [2 /*return*/];
                            }
                        });
                    }); })).catch(console.error);
                    return [4 /*yield*/, system.morph.getShrinkwrapped(name)];
                case 4:
                    shrinkwrapped = _a.sent();
                    dependencies.forEach(function (dependency) {
                        dependency.has = shrinkwrapped[dependency.name] || '';
                    });
                    return [4 /*yield*/, updated()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, updateLazy];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getDependencies = function () { return dependencies; };
    var getLinking = function () { return linking.slice(); };
    var updateLocalVersion = function () { return __awaiter(_this, void 0, void 0, function () {
        var packageContents;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, readPackage()];
                case 1:
                    packageContents = _a.sent();
                    versions.local = packageContents.version;
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchEnvironmentVersionAndUpdate = function (environment) { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = versions;
                    _b = environment;
                    return [4 /*yield*/, system.morph.getVersionOnEnvironment(name, environment)];
                case 1:
                    _a[_b] = _c.sent();
                    return [4 /*yield*/, updated()];
                case 2:
                    _c.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var updateEnvironmentVersions = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        fetchEnvironmentVersionAndUpdate('int'),
                        fetchEnvironmentVersionAndUpdate('test'),
                        fetchEnvironmentVersionAndUpdate('live'),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var fetchDetails = function () { return __awaiter(_this, void 0, void 0, function () {
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        (function () { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, updateURL()];
                                    case 1:
                                        _a.sent();
                                        return [4 /*yield*/, updateLocalVersion()];
                                    case 2:
                                        _a.sent();
                                        return [4 /*yield*/, updated()];
                                    case 3:
                                        _a.sent();
                                        return [4 /*yield*/, updateEnvironmentVersions()];
                                    case 4:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })(),
                        updateDependencies(),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var getVersions = function () { return (__assign({}, versions)); };
    var getUseCache = function () { return Boolean(state.retrieve("cache.enabled." + name)); };
    var getFavorite = function () { return Boolean(state.retrieve("favorite." + name)); };
    var getHistory = function () { return state.retrieve("history." + name) || []; };
    var setUseCache = function (useCache) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, state.store("cache.enabled." + name, useCache)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updated()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, stateMachine.restart()];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var setFavorite = function (favorite) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, state.store("favorite." + name, favorite ? favorite : null)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var request = function (props, history) { return __awaiter(_this, void 0, void 0, function () {
        var response, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = request_1.default;
                    _b = [system,
                        config,
                        state,
                        name,
                        getState()];
                    return [4 /*yield*/, getType()];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(),
                        getPort(),
                        props,
                        log,
                        history]))];
                case 2:
                    response = _c.sent();
                    if (!history) return [3 /*break*/, 4];
                    return [4 /*yield*/, updated()];
                case 3:
                    _c.sent();
                    _c.label = 4;
                case 4: return [2 /*return*/, response];
            }
        });
    }); };
    var getPromoting = function () { return promoting; };
    var getPromotionFailure = function () { return promotionFailure; };
    var promote = function (environment) { return __awaiter(_this, void 0, void 0, function () {
        var failure_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(environment === 'test' || environment === 'live')) return [3 /*break*/, 8];
                    promoting = environment;
                    promotionFailure = null;
                    return [4 /*yield*/, updated()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    return [4 /*yield*/, system.morph.promote(name, environment)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, updateEnvironmentVersions()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 5:
                    failure_1 = _a.sent();
                    promotionFailure = failure_1;
                    return [3 /*break*/, 6];
                case 6:
                    promoting = null;
                    return [4 /*yield*/, updated()];
                case 7:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 8: throw new Error('Invalid environment');
                case 9: return [2 /*return*/];
            }
        });
    }); };
    var openInEditor = function () { return editor_1.default(system, componentPath); };
    var actions = ComponentActions_1.default(system, routing, config, componentPath, name, getPort, log, getOther, getUseCache, onReload);
    var stateMachine = ComponentStateMachine_1.default(actions, function () { return updated(); });
    var getState = function () { return stateMachine.getState(); };
    var reinstall = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, stateMachine.reinstall()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, updateDependencies()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var link = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linking.push(dependency);
                    return [4 /*yield*/, stateMachine.link(dependency)];
                case 1:
                    _a.sent();
                    linking.splice(linking.indexOf(dependency), 1);
                    return [4 /*yield*/, updateDependencies()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var unlink = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    linking.push(dependency);
                    return [4 /*yield*/, stateMachine.unlink(dependency)];
                case 1:
                    _a.sent();
                    linking.splice(linking.indexOf(dependency), 1);
                    return [4 /*yield*/, updateDependencies()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var makeLinkable = function () { return stateMachine.makeLinkable(); };
    var start = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, updateURL()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, stateMachine.run()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var stop = function () { return stateMachine.stop(); };
    var build = function (isSassOnly, changedPath) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (changedPath) {
                        log("Rebuilding due to change in " + changedPath);
                    }
                    if (!isSassOnly) return [3 /*break*/, 2];
                    return [4 /*yield*/, stateMachine.buildSass()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, stateMachine.buildAll()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    }); };
    var getLatestVersion = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = versions;
                    return [4 /*yield*/, system.morph.getVersionOnEnvironment(name, 'int')];
                case 1:
                    _a.int = _b.sent();
                    return [2 /*return*/, versions.int];
            }
        });
    }); };
    var bump = function (type) { return __awaiter(_this, void 0, void 0, function () {
        var canBump, packageContents, newVersion, newBranch, _a, currentBranch;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    promoting = 'int';
                    promotionFailure = null;
                    return [4 /*yield*/, updated()];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, system.git.readyToCommit(componentPath)];
                case 2:
                    canBump = _b.sent();
                    if (!!canBump) return [3 /*break*/, 4];
                    promoting = null;
                    promotionFailure = 'Cannot bump when files are already staged for commit.';
                    log(promotionFailure);
                    return [4 /*yield*/, updated()];
                case 3:
                    _b.sent();
                    return [2 /*return*/, null];
                case 4: return [4 /*yield*/, readPackage()];
                case 5:
                    packageContents = _b.sent();
                    newVersion = semver.inc(packageContents.version, type);
                    packageContents.version = newVersion;
                    return [4 /*yield*/, system.file.writeFile(getPackagePath(), JSON.stringify(packageContents, null, 2) + "\n")];
                case 6:
                    _b.sent();
                    _a = "bump-" + name + "-";
                    return [4 /*yield*/, system.git.getRandomBranchName()];
                case 7:
                    newBranch = _a + (_b.sent());
                    return [4 /*yield*/, system.git.getCurrentBranch(componentPath)];
                case 8:
                    currentBranch = _b.sent();
                    return [4 /*yield*/, system.git.checkoutNewBranch(componentPath, newBranch)];
                case 9:
                    _b.sent();
                    return [4 /*yield*/, system.git.stageFile(componentPath, 'package.json')];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, system.git.commit(componentPath, "bump " + name + " to " + newVersion)];
                case 11:
                    _b.sent();
                    return [4 /*yield*/, system.git.push(componentPath, newBranch)];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, system.git.checkoutExistingBranch(componentPath, currentBranch)];
                case 13:
                    _b.sent();
                    log("Bumped to version " + newVersion + " on branch " + newBranch + ".");
                    return [4 /*yield*/, system.process.open("https://github.com/bbc/morph-modules/compare/" + newBranch + "?expand=1")];
                case 14:
                    _b.sent();
                    promoting = null;
                    return [4 /*yield*/, updateLocalVersion()];
                case 15:
                    _b.sent();
                    return [4 /*yield*/, updated()];
                case 16:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        build: build,
        bump: bump,
        fetchDetails: fetchDetails,
        getDependencies: getDependencies,
        getDirectoryName: getDirectoryName,
        getDisplayName: getDisplayName,
        getFavorite: getFavorite,
        getHistory: getHistory,
        getLatestVersion: getLatestVersion,
        getLinking: getLinking,
        getName: getName,
        getPromoting: getPromoting,
        getPromotionFailure: getPromotionFailure,
        getState: getState,
        getType: getType,
        getURL: getURL,
        getUseCache: getUseCache,
        getVersions: getVersions,
        link: link,
        makeLinkable: makeLinkable,
        openInEditor: openInEditor,
        promote: promote,
        reinstall: reinstall,
        request: request,
        setFavorite: setFavorite,
        setPagePort: setPagePort,
        setUseCache: setUseCache,
        start: start,
        stop: stop,
        unlink: unlink,
    };
};
exports.default = Component;
//# sourceMappingURL=Component.js.map