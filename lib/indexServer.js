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
var child_process_1 = require("child_process");
var http_1 = require("http");
var path_1 = require("path");
var socketIo = require("socket.io");
var app_1 = require("./server/app/app");
var System_1 = require("./server/system/System");
var startServer = function () { return __awaiter(_this, void 0, void 0, function () {
    var sendComponentData, sendReload, sendUpdated, onComponentUpdate, onReload, onUpdated, startServer, packageJSON, _a, api, component, devMode, config, service, apiServer, componentServer, io, url, canOpen;
    var _this = this;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                onComponentUpdate = function (data) {
                    if (sendComponentData) {
                        sendComponentData(data);
                    }
                };
                onReload = function () {
                    if (sendReload) {
                        sendReload();
                    }
                };
                onUpdated = function () {
                    if (sendUpdated) {
                        sendUpdated();
                    }
                };
                startServer = function (server, port) { return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, new Promise(function (resolve) {
                                    server.listen(port, function () {
                                        resolve();
                                    });
                                })];
                            case 1:
                                _a.sent();
                                return [2 /*return*/];
                        }
                    });
                }); };
                packageJSON = require(path_1.join(__dirname, '../package.json'));
                return [4 /*yield*/, app_1.default(System_1.default, onComponentUpdate, onReload, onUpdated, startServer, packageJSON.version)];
            case 1:
                _a = _b.sent(), api = _a.api, component = _a.component, devMode = _a.devMode, config = _a.config, service = _a.service;
                apiServer = new http_1.Server(api);
                componentServer = new http_1.Server(component);
                io = socketIo(apiServer);
                sendComponentData = function (data) {
                    io.emit('component', data);
                };
                sendReload = function () {
                    io.emit('reload');
                };
                sendUpdated = function () {
                    io.emit('updated');
                };
                return [4 /*yield*/, new Promise(function (resolve) {
                        apiServer.listen(3333, function () {
                            resolve();
                        });
                    })];
            case 2:
                _b.sent();
                return [4 /*yield*/, new Promise(function (resolve) {
                        componentServer.listen(4000, function () {
                            resolve();
                        });
                    })];
            case 3:
                _b.sent();
                url = 'http://localhost:3333';
                console.log("[console] Running at " + url);
                canOpen = config.getValue('openOnStart') !== false;
                if (!devMode && canOpen) {
                    child_process_1.spawn('open', [url]);
                }
                io.on('connection', function (socket) {
                    io.emit('freshState', service.getComponentsData());
                });
                return [2 /*return*/];
        }
    });
}); };
exports.default = startServer;
//# sourceMappingURL=indexServer.js.map