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
var fs_extra_1 = require("fs-extra");
var path_1 = require("path");
var tar = require("tar");
var runNpm_1 = require("../../helpers/runNpm");
var System_1 = require("../System");
var extract = function (directory, tarballName, file) {
    return new Promise(function (resolve, reject) {
        var tarballPath = path_1.join(directory, tarballName);
        tar.extract({
            cwd: directory,
            file: tarballPath,
        }, [file], function (error) {
            if (error) {
                reject(error);
            }
            else {
                var extractedPath = path_1.join(directory, file);
                try {
                    var contents = fs_extra_1.readFileSync(extractedPath, 'utf-8');
                    resolve(contents);
                }
                catch (readError) {
                    reject(readError);
                }
            }
        });
    });
};
var pack = function (directory, packageName) { return __awaiter(_this, void 0, void 0, function () {
    var output;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                output = '';
                return [4 /*yield*/, runNpm_1.default(System_1.default, directory, ['pack', packageName], function (message) {
                        output = message.toString().trim();
                    }, function (message) { return null; })];
            case 1:
                _a.sent();
                return [2 /*return*/, output];
        }
    });
}); };
var getVersions = function (raw) {
    var shrinkwrap = JSON.parse(raw);
    var has = {};
    Object.keys(shrinkwrap.dependencies).forEach(function (dependency) {
        has[dependency] = shrinkwrap.dependencies[dependency].version;
    });
    return has;
};
var getShrinkwrap = function (packageName) { return __awaiter(_this, void 0, void 0, function () {
    var directory, tarballName, raw, ex_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                directory = '/tmp/morph-dependencies';
                fs_extra_1.emptyDirSync(directory);
                return [4 /*yield*/, pack(directory, packageName)];
            case 1:
                tarballName = _a.sent();
                return [4 /*yield*/, extract(directory, tarballName, 'package/npm-shrinkwrap.json')];
            case 2:
                raw = _a.sent();
                return [2 /*return*/, getVersions(raw)];
            case 3:
                ex_1 = _a.sent();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/, {}];
        }
    });
}); };
exports.default = getShrinkwrap;
//# sourceMappingURL=shrinkwrapped.js.map