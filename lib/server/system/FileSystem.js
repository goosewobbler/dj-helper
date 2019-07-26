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
var graceful_fs_1 = require("graceful-fs");
var fp_1 = require("lodash/fp");
var ls = require("ls");
var ncp = require("ncp");
var watch = require("node-watch");
var path_1 = require("path");
var ignore = [
    '/.tscache/',
    '/.cache/',
    '/.git/',
    '/coverage/',
    '/node_modules/',
    '/test/',
    '/package.json',
    '/package-lock.json',
    '/shrinkwrap.yaml',
];
var exists = function (path) { return Promise.resolve(graceful_fs_1.existsSync(path)); };
var getPackageDirectories = function (directory) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, ls(path_1.join(directory, '*'))
                .filter(function (file) { return graceful_fs_1.lstatSync(file.full).isDirectory(); })
                .filter(function (file) { return graceful_fs_1.existsSync(path_1.join(file.full, 'package.json')); })
                .map(function (file) { return file.name; })];
    });
}); };
var readFile = function (path) { return Promise.resolve(graceful_fs_1.readFileSync(path).toString()); };
var writeFile = function (path, contents) { return Promise.resolve(graceful_fs_1.writeFileSync(path, contents)); };
var symbolicLinkExists = function (path) { return Promise.resolve(graceful_fs_1.existsSync(path) && graceful_fs_1.lstatSync(path).isSymbolicLink()); };
var deleteDirectory = function (directory) { return __awaiter(_this, void 0, void 0, function () {
    var to;
    return __generator(this, function (_a) {
        try {
            to = "/tmp/mdc.deleted." + Date.now();
            fs_extra_1.moveSync(directory, to);
        }
        catch (ex) {
            // ignore
        }
        try {
            fs_extra_1.ensureDirSync(directory);
        }
        catch (ex) {
            // ignore
        }
        return [2 /*return*/];
    });
}); };
var watchDirectory = function (directory, callback) {
    return Promise.resolve(watch(directory, {
        filter: function (name) { return !fp_1.some(function (pathToIgnore) { return name.indexOf(pathToIgnore) > -1; }, ignore); },
        recursive: true,
    }, function (event, fileName) {
        if (event === 'remove' || graceful_fs_1.lstatSync(fileName).isFile()) {
            var fileChanged = fileName.replace(directory + "/", '');
            callback(fileChanged);
        }
    }));
};
var copyDirectory = function (from, to) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, new Promise(function (resolve, reject) {
                return ncp(from, to, function (error) {
                    if (error) {
                        reject(error);
                    }
                    else {
                        resolve();
                    }
                });
            })];
    });
}); };
var moveDirectory = function (from, to) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            fs_extra_1.moveSync(from, to);
        }
        catch (ex) {
            console.error(ex);
        }
        return [2 /*return*/];
    });
}); };
var createSymlink = function (from, to) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            graceful_fs_1.symlinkSync(from, to);
        }
        catch (ex) {
            console.error(ex);
        }
        return [2 /*return*/];
    });
}); };
var removeSymlink = function (path) { return __awaiter(_this, void 0, void 0, function () {
    return __generator(this, function (_a) {
        try {
            graceful_fs_1.unlinkSync(path);
        }
        catch (ex) {
            console.error(ex);
        }
        return [2 /*return*/];
    });
}); };
var FileSystem = {
    copyDirectory: copyDirectory,
    createSymlink: createSymlink,
    deleteDirectory: deleteDirectory,
    exists: exists,
    getPackageDirectories: getPackageDirectories,
    moveDirectory: moveDirectory,
    readFile: readFile,
    removeSymlink: removeSymlink,
    symbolicLinkExists: symbolicLinkExists,
    watchDirectory: watchDirectory,
    writeFile: writeFile,
};
exports.default = FileSystem;
//# sourceMappingURL=FileSystem.js.map