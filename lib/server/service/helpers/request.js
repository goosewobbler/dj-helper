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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var ComponentState_1 = require("../../../types/ComponentState");
var ComponentType_1 = require("../types/ComponentType");
var requestWithRetries = function (system, name, type, port, propsString, log, retries) { return __awaiter(_this, void 0, void 0, function () {
    var requestType, requestUrl, response, body, headers, statusCode, reason, remainingRetries, modifiedBody;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requestType = type === ComponentType_1.default.Page || type === ComponentType_1.default.Data ? 'data' : 'view';
                requestUrl = "http://localhost:" + port + "/" + requestType + "/" + name + propsString;
                log("Requesting " + requestUrl);
                return [4 /*yield*/, system.network.get(requestUrl)];
            case 1:
                response = _a.sent();
                if (!response) {
                    return [2 /*return*/, { body: '', headers: {}, statusCode: 404 }];
                }
                body = response.body, headers = response.headers, statusCode = response.statusCode;
                if (retries > 0 &&
                    (fp_1.startsWith('Template had dependencies that required success but were not successful', body) ||
                        fp_1.startsWith('Template has these missing dependencies', body) ||
                        body.indexOf('ECONNREFUSED') !== -1)) {
                    reason = body.split('\n')[0];
                    remainingRetries = retries - 1;
                    log("Trying again because: " + reason + " (" + remainingRetries + " " + (remainingRetries === 1
                        ? 'retry'
                        : 'retries') + " remaining).");
                    return [2 /*return*/, requestWithRetries(system, name, type, port, propsString, log, remainingRetries)];
                }
                modifiedBody = body
                    .replace(/localhost:8082/g, "localhost:" + port)
                    .replace(/react\.min/g, 'react')
                    .replace(/react-dom\.min/g, 'react-dom')
                    .replace(/'live-push' : '[^']+'/g, "'live-push' : '//localhost:3333/local-push'");
                return [2 /*return*/, { body: modifiedBody, headers: headers, statusCode: statusCode }];
        }
    });
}); };
var getNewHistory = function (currentHistory, newEntry) {
    var currentHistoryWithoutNewEntry = currentHistory.slice();
    var indexOfNewEntry = currentHistoryWithoutNewEntry.indexOf(newEntry);
    if (indexOfNewEntry !== -1) {
        currentHistoryWithoutNewEntry.splice(indexOfNewEntry, 1);
    }
    var newHistory = [newEntry].concat(currentHistoryWithoutNewEntry);
    if (newHistory.length > 10) {
        return newHistory.slice(0, 10);
    }
    return newHistory;
};
var request = function (system, config, state, name, currentState, type, port, props, log, history) { return __awaiter(_this, void 0, void 0, function () {
    var version, nonVersionProps, propsString, stateKey, currentHistory, newEntry, retries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (currentState !== ComponentState_1.default.Running) {
                    throw new Error('Component is not running');
                }
                version = props.version, nonVersionProps = __rest(props, ["version"]);
                propsString = Object.keys(nonVersionProps).reduce(function (acc, propName) { return acc + "/" + encodeURIComponent(propName) + "/" + encodeURIComponent(nonVersionProps[propName]); }, '');
                if (!history) return [3 /*break*/, 2];
                stateKey = "history." + name;
                currentHistory = state.retrieve(stateKey) || [];
                newEntry = type === ComponentType_1.default.Page ? props.path || '' : propsString;
                return [4 /*yield*/, state.store(stateKey, getNewHistory(currentHistory, newEntry))];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2:
                retries = config.getValue('retries') || 10;
                return [2 /*return*/, requestWithRetries(system, name, type, port, propsString, log, retries)];
        }
    });
}); };
exports.default = request;
//# sourceMappingURL=request.js.map