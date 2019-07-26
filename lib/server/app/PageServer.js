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
var url = require("url");
var ceefaxStyle_1 = require("./helpers/ceefaxStyle");
var headScript = function (config) {
    return "<script src=\"http://localhost:3333/socket.io/socket.io.js\"></script>" + (config.getValue('ceefax') === true
        ? ceefaxStyle_1.default
        : '');
};
var bodyScript = '<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script>';
var extractHtml = function (body) {
    // Old versions of morph-cli v15 and below used to incorrectly JSON-encode text/html responses.
    // As of morph-cli v16.X, this is no logner the case, matching the behaviour of the renderers.
    // We should support either version.
    try {
        var parsed = JSON.parse(body);
        return typeof parsed === 'string' ? parsed : body;
    }
    catch (ex) {
        return body;
    }
};
var createResponse = function (config, body, statusCode) {
    if (statusCode === 404 && (!body || body === '{}')) {
        return "<!doctype html><html lang=\"en-gb\"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style=\"font-size: 48px;\">404 \uD83D\uDE15</pre></body></html>";
    }
    return extractHtml(body)
        .replace('<head>', "<head>" + headScript(config))
        .replace('</body>', bodyScript + "</body>");
};
var createPageServer = function (service, config, componentName) {
    var server = express();
    server.get('*', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
        var accept, history_1, query, path, props, _a, body, headers, pageStatusCode, pageLocation, ex_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    accept = req.headers.accept;
                    history_1 = !accept || accept.indexOf('text/html') !== -1;
                    query = url.parse(req.url).query || '';
                    path = req.path + (query ? "?" + query : '');
                    props = {
                        closeEnvelope: 'true',
                        path: path,
                    };
                    return [4 /*yield*/, service.request(componentName, props, history_1)];
                case 1:
                    _a = _b.sent(), body = _a.body, headers = _a.headers;
                    pageStatusCode = Number(headers['x-page-status-code']) || 200;
                    pageLocation = headers['x-page-location'];
                    if (pageLocation) {
                        res.set('Location', pageLocation);
                    }
                    res
                        .status(pageStatusCode)
                        .set(headers)
                        .set('Content-Type', 'text/html')
                        .send(createResponse(config, body, pageStatusCode));
                    return [3 /*break*/, 3];
                case 2:
                    ex_1 = _b.sent();
                    res.status(500).send(ex_1.message);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    return server;
};
exports.default = createPageServer;
//# sourceMappingURL=PageServer.js.map