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
var ComponentState_1 = require("../../types/ComponentState");
var Component_1 = require("./Component");
var create_1 = require("./helpers/create");
var Routing_1 = require("./Routing");
var ComponentType_1 = require("./types/ComponentType");
var Service = function (system, config, state, onComponentUpdate, onReload, startPageServer, options) { return __awaiter(_this, void 0, void 0, function () {
    var components, nextPort, routing, editors, acquirePort, onComponentUpdated, addComponent, load, getComponent, getSummaryData, getData, create, getComponentsData, getComponentsSummaryData, bump, build, fetchDetails, link, openInEditor, promote, reinstall, request, setFavorite, setUseCache, start, stop, unlink;
    var _this = this;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                components = [];
                nextPort = 8083;
                editors = [];
                acquirePort = function () { return nextPort++; };
                onComponentUpdated = function (name) { return __awaiter(_this, void 0, void 0, function () {
                    var data;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, getData(name)];
                            case 1:
                                data = _a.sent();
                                onComponentUpdate(data);
                                return [2 /*return*/];
                        }
                    });
                }); };
                addComponent = function (componentDirectoryName) { return __awaiter(_this, void 0, void 0, function () {
                    var componentDirectory, packageContents, _a, _b, component;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0:
                                componentDirectory = path_1.join(options.componentsDirectory, componentDirectoryName);
                                _b = (_a = JSON).parse;
                                return [4 /*yield*/, system.file.readFile(path_1.join(componentDirectory, 'package.json'))];
                            case 1:
                                packageContents = _b.apply(_a, [_c.sent()]);
                                component = Component_1.default(system, routing, config, state, packageContents.name, componentDirectoryName, componentDirectory, acquirePort, onComponentUpdated, onReload, getComponent);
                                components.push(component);
                                return [2 /*return*/, component];
                        }
                    });
                }); };
                load = function () { return __awaiter(_this, void 0, void 0, function () {
                    var packageDirectories, _a, _b;
                    var _this = this;
                    return __generator(this, function (_c) {
                        switch (_c.label) {
                            case 0: return [4 /*yield*/, Routing_1.default(options.routingFilePath, system)];
                            case 1:
                                routing = _c.sent();
                                return [4 /*yield*/, system.file.getPackageDirectories(options.componentsDirectory)];
                            case 2:
                                packageDirectories = _c.sent();
                                return [4 /*yield*/, Promise.all(packageDirectories.map(addComponent))];
                            case 3:
                                _c.sent();
                                return [4 /*yield*/, system.file.watchDirectory(options.componentsDirectory, function (path) { return __awaiter(_this, void 0, void 0, function () {
                                        var relativePath, slashIndex, directoryName, changedComponent, isSass;
                                        return __generator(this, function (_a) {
                                            switch (_a.label) {
                                                case 0:
                                                    relativePath = path.replace(options.componentsDirectory + '/', '');
                                                    slashIndex = relativePath.indexOf('/');
                                                    directoryName = relativePath.substr(0, slashIndex);
                                                    changedComponent = components.find(function (component) { return component.getDirectoryName() === directoryName; });
                                                    if (!(changedComponent && changedComponent.getState() === ComponentState_1.default.Running)) return [3 /*break*/, 2];
                                                    isSass = relativePath.indexOf('/sass/') > -1;
                                                    return [4 /*yield*/, changedComponent.build(isSass, relativePath.replace(directoryName + '/', ''))];
                                                case 1:
                                                    _a.sent();
                                                    _a.label = 2;
                                                case 2: return [2 /*return*/];
                                            }
                                        });
                                    }); })];
                            case 4:
                                _c.sent();
                                _b = (_a = system.process).runToCompletion;
                                return [4 /*yield*/, system.process.getCurrentWorkingDirectory()];
                            case 5: return [4 /*yield*/, _b.apply(_a, [_c.sent(),
                                    'which code',
                                    function (message) {
                                        editors.push('code');
                                    },
                                    function () { return null; }])];
                            case 6:
                                _c.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                getComponent = function (name) { return components.find(function (component) { return component.getName() === name; }); };
                getSummaryData = function (name) {
                    var component = getComponent(name);
                    return {
                        displayName: component.getDisplayName(),
                        favorite: component.getFavorite(),
                        name: component.getName(),
                        state: component.getState(),
                        useCache: component.getUseCache(),
                    };
                };
                getData = function (name) {
                    var component = getComponent(name);
                    return {
                        dependencies: component.getDependencies(),
                        displayName: component.getDisplayName(),
                        favorite: component.getFavorite(),
                        history: component.getHistory(),
                        linking: component.getLinking(),
                        name: component.getName(),
                        promoting: component.getPromoting(),
                        promotionFailure: component.getPromotionFailure(),
                        state: component.getState(),
                        url: component.getURL(),
                        useCache: component.getUseCache(),
                        versions: component.getVersions(),
                    };
                };
                create = function (name, type, createOptions) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, create_1.default(system, name, type, createOptions)];
                            case 1:
                                _a.sent();
                                return [4 /*yield*/, addComponent(name)];
                            case 2:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                getComponentsData = function () { return ({
                    components: components.map(function (component) { return getData(component.getName()); }),
                    editors: editors,
                }); };
                getComponentsSummaryData = function () { return ({
                    components: components.map(function (component) {
                        return component.getState() === ComponentState_1.default.Running
                            ? getData(component.getName())
                            : getSummaryData(component.getName());
                    }),
                    editors: editors,
                }); };
                bump = function (name, type) { return getComponent(name).bump(type); };
                build = function (name) { return getComponent(name).build(); };
                fetchDetails = function (name) { return getComponent(name).fetchDetails(); };
                link = function (name, dependency) { return getComponent(name).link(dependency); };
                openInEditor = function (name) { return getComponent(name).openInEditor(); };
                promote = function (name, environment) { return getComponent(name).promote(environment); };
                reinstall = function (name) { return getComponent(name).reinstall(); };
                request = function (name, props, history) {
                    return getComponent(name).request(props, history);
                };
                setFavorite = function (name, useCache) { return getComponent(name).setFavorite(useCache); };
                setUseCache = function (name, useCache) { return getComponent(name).setUseCache(useCache); };
                start = function (name) { return __awaiter(_this, void 0, void 0, function () {
                    var component, port;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                component = getComponent(name);
                                return [4 /*yield*/, component.getType()];
                            case 1:
                                if (!((_a.sent()) === ComponentType_1.default.Page)) return [3 /*break*/, 3];
                                return [4 /*yield*/, startPageServer(name)];
                            case 2:
                                port = _a.sent();
                                component.setPagePort(port);
                                _a.label = 3;
                            case 3: return [4 /*yield*/, component.start()];
                            case 4:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                stop = function (name) { return getComponent(name).stop(); };
                unlink = function (name, dependency) { return getComponent(name).unlink(dependency); };
                return [4 /*yield*/, load()];
            case 1:
                _a.sent();
                return [2 /*return*/, {
                        build: build,
                        bump: bump,
                        create: create,
                        fetchDetails: fetchDetails,
                        getComponentsData: getComponentsData,
                        getComponentsSummaryData: getComponentsSummaryData,
                        link: link,
                        openInEditor: openInEditor,
                        promote: promote,
                        reinstall: reinstall,
                        request: request,
                        setFavorite: setFavorite,
                        setUseCache: setUseCache,
                        start: start,
                        stop: stop,
                        unlink: unlink,
                    }];
        }
    });
}); };
exports.default = Service;
//# sourceMappingURL=Service.js.map