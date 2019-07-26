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
var express = require("express");
var convertPropsString = function (propsString) {
    var props = {};
    var parts = propsString.split('/');
    for (var i = 1; i < parts.length; i += 2) {
        props[decodeURIComponent(parts[i])] = decodeURIComponent(parts[i + 1]);
    }
    return props;
};
var createViewPage = function (response) {
    return [
        '<!doctype html>',
        '<html class="b-pw-1280">',
        '<head>',
        '<meta charset="utf-8">',
        '<meta http-equiv="x-ua-compatible" content="ie=edge">',
        '<meta name="viewport" content="width=device-width, initial-scale=1">',
        '<link rel="shortcut icon" type="image/png" href="http://localhost:3333/image/icon/morph.png"/>',
        '<script src="http://localhost:3333/socket.io/socket.io.js"></script>',
        (response.head || []).join(''),
        '<style>body {font-size: 62.5%;line-height: 1;}</style>',
        '</head>',
        '<body>',
        response.bodyInline,
        '<script src="//m.int.files.bbci.co.uk/modules/vendor/requirejs/2.1.20/require.min.js"></script>',
        (response.bodyLast || []).join(''),
        '<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script>',
        '</body>',
        '</html>',
    ].join('');
};
var createComponentServer = function (service) {
    var server = express();
    server.get('/data/:name*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accept, history_1, propsString, _a, body, headers, statusCode, ex_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    accept = req.headers.accept;
                    history_1 = !accept || accept.indexOf('text/html') !== -1;
                    propsString = req.path.replace("/data/" + req.params.name, '');
                    return [4 /*yield*/, service.request(req.params.name, convertPropsString(propsString), history_1)];
                case 1:
                    _a = _b.sent(), body = _a.body, headers = _a.headers, statusCode = _a.statusCode;
                    res
                        .status(statusCode)
                        .set(headers)
                        .send(body);
                    return [3 /*break*/, 3];
                case 2:
                    ex_1 = _b.sent();
                    res.status(500).send(ex_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.get('/view/:name*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accept, history_2, propsString, _a, body, headers, statusCode, ex_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    accept = req.headers.accept;
                    history_2 = !accept || accept.indexOf('text/html') !== -1;
                    propsString = req.path.replace("/view/" + req.params.name, '');
                    return [4 /*yield*/, service.request(req.params.name, convertPropsString(propsString), history_2)];
                case 1:
                    _a = _b.sent(), body = _a.body, headers = _a.headers, statusCode = _a.statusCode;
                    if (statusCode === 200) {
                        res.send(createViewPage(JSON.parse(body)));
                    }
                    else {
                        res
                            .status(statusCode)
                            .set(headers)
                            .send(body);
                    }
                    return [3 /*break*/, 3];
                case 2:
                    ex_2 = _b.sent();
                    res.status(500).send(ex_2.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    server.get('/proxy/:name*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var propsString, _a, body, headers, statusCode, ex_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    propsString = req.path.replace("/proxy/" + req.params.name, '');
                    return [4 /*yield*/, service.request(req.params.name, convertPropsString(propsString), false)];
                case 1:
                    _a = _b.sent(), body = _a.body, headers = _a.headers, statusCode = _a.statusCode;
                    res
                        .status(statusCode)
                        .set(headers)
                        .send(body);
                    return [3 /*break*/, 3];
                case 2:
                    ex_3 = _b.sent();
                    res.status(500).send(ex_3.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return server;
};
exports.default = createComponentServer;
//# sourceMappingURL=ComponentServer.js.map