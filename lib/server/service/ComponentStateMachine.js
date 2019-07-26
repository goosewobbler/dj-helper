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
var ComponentState_1 = require("../../types/ComponentState");
var ComponentStateMachine = function (actions, onStateChanged) {
    var currentState = ComponentState_1.default.Stopped;
    var getState = function () { return currentState; };
    var changeState = function (newState) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    currentState = newState;
                    return [4 /*yield*/, onStateChanged(newState)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var run = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, actions.needsInstall()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 9];
                    return [4 /*yield*/, changeState(ComponentState_1.default.Installing)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.install()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 8:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 9: return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 10:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 11:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 12:
                    _a.sent();
                    _a.label = 13;
                case 13: return [2 /*return*/];
            }
        });
    }); };
    var stop = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Stopped)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var buildAll = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var buildSass = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.buildSass()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var reinstall = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Installing)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.uninstall()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, actions.install()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var link = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Linking)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.makeOtherLinkable(dependency)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, actions.link(dependency)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 8:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 9:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var unlink = function (dependency) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Linking)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.unlink(dependency)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 7:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 8:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var makeLinkable = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(currentState === ComponentState_1.default.Stopped)) return [3 /*break*/, 8];
                    return [4 /*yield*/, actions.needsInstall()];
                case 1:
                    if (!_a.sent()) return [3 /*break*/, 4];
                    return [4 /*yield*/, changeState(ComponentState_1.default.Installing)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, actions.install()];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, changeState(ComponentState_1.default.Building)];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, actions.buildAll()];
                case 6:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Stopped)];
                case 7:
                    _a.sent();
                    _a.label = 8;
                case 8: return [2 /*return*/];
            }
        });
    }); };
    var restart = function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, changeState(ComponentState_1.default.Stopped)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, actions.stop()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Starting)];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, actions.run()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, changeState(ComponentState_1.default.Running)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    return {
        buildAll: buildAll,
        buildSass: buildSass,
        getState: getState,
        link: link,
        makeLinkable: makeLinkable,
        reinstall: reinstall,
        restart: restart,
        run: run,
        stop: stop,
        unlink: unlink,
    };
};
exports.default = ComponentStateMachine;
//# sourceMappingURL=ComponentStateMachine.js.map