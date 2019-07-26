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
var semver_1 = require("semver");
var runNpm_1 = require("../helpers/runNpm");
var Updater = function (system, currentVersion) {
    var fetchNewVersion = function () { return __awaiter(_this, void 0, void 0, function () {
        var version, installPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    version = null;
                    installPath = '/tmp/morph-developer-console-version';
                    return [4 /*yield*/, system.file.deleteDirectory(installPath)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, runNpm_1.default(system, installPath, ['install', 'git+ssh://git@github.com:bbc/morph-developer-console.git#version'], function (output) {
                            var versionMatches = /morph-developer-console@(\d+).(\d+).(\d+)/.exec(output);
                            if (versionMatches) {
                                var major = Number(versionMatches[1]);
                                var minor = Number(versionMatches[2]);
                                var patch = Number(versionMatches[3]);
                                var latestVersion = major + "." + minor + "." + patch;
                                if (semver_1.gt(latestVersion, currentVersion)) {
                                    version = latestVersion;
                                }
                            }
                        }, function () { return null; })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, version];
            }
        });
    }); };
    var updating = false;
    var updated = false;
    var getStatus = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {
                        currentVersion: currentVersion
                    };
                    return [4 /*yield*/, fetchNewVersion()];
                case 1: return [2 /*return*/, (_a.updateAvailable = _b.sent(),
                        _a.updated = updated,
                        _a.updating = updating,
                        _a)];
            }
        });
    }); };
    var update = function () { return __awaiter(_this, void 0, void 0, function () {
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    updating = true;
                    system.process.log('[console] Updating Morph Developer Console...');
                    _a = runNpm_1.default;
                    _b = [system];
                    return [4 /*yield*/, system.process.getCurrentWorkingDirectory()];
                case 1: return [4 /*yield*/, _a.apply(void 0, _b.concat([_c.sent(),
                        ['install', 'git+ssh://git@github.com:bbc/morph-developer-console.git', '--global', '--production'],
                        function () { return null; },
                        function () { return null; }]))];
                case 2:
                    _c.sent();
                    system.process.log('[console] Morph Developer Console updated sucessfully. Restart to apply updates.');
                    updating = false;
                    updated = true;
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        getStatus: getStatus,
        update: update,
    };
};
exports.default = Updater;
//# sourceMappingURL=Updater.js.map