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
var chalk = require("chalk");
var child_process_1 = require("child_process");
var stripAnsi = require("strip-ansi");
var MESSAGE_NAME_PATTERN = /^(\[[^\]]+\]) .+/;
var MESSAGE_REPLACE_PATTERN = /.*\[\d\d\d\] http.+( {.+})$/;
var MESSAGE_STATUS_CODE_PATTERN = /\[(\d\d\d)\]/;
var NAME_COLOURS = [chalk.blue, chalk.magenta, chalk.cyan, chalk.yellow, chalk.white];
var assignedNameColours = {};
var nextColour = 0;
var trim = function (s) { return stripAnsi(s.toString()).trim(); };
var log = function (message) {
    var removeMatches = MESSAGE_REPLACE_PATTERN.exec(message);
    var shortMessage = trim(removeMatches ? message.replace(removeMatches[1], '') : message);
    if (shortMessage) {
        var statusMatches = MESSAGE_STATUS_CODE_PATTERN.exec(shortMessage);
        var statusCode = '';
        if (statusMatches) {
            statusCode = statusMatches[1];
        }
        var nameMatches = MESSAGE_NAME_PATTERN.exec(shortMessage);
        var name_1 = '';
        var details = shortMessage;
        if (nameMatches) {
            name_1 = nameMatches[1];
            details = shortMessage.substr(name_1.length + 1);
        }
        if (name_1 && !(name_1 in assignedNameColours)) {
            assignedNameColours[name_1] = NAME_COLOURS[nextColour % NAME_COLOURS.length];
            nextColour += 1;
        }
        var nameColour = assignedNameColours[name_1] || NAME_COLOURS[0];
        if (statusCode === '200') {
            console.log(nameColour(name_1) + (name_1 ? ' ' : '') + chalk.green(details));
        }
        else if (statusCode === '202') {
            console.log(nameColour(name_1) + (name_1 ? ' ' : '') + chalk.yellow(details));
        }
        else if (statusCode) {
            console.log(nameColour(name_1) + (name_1 ? ' ' : '') + chalk.red(details));
        }
        else {
            console.log(nameColour(name_1) + (name_1 ? ' ' : '') + details);
        }
    }
};
var getCommandLineArgs = function () { return Promise.resolve(process.argv.slice(1)); };
var getCurrentWorkingDirectory = function () { return Promise.resolve(process.cwd()); };
var open = function (url) {
    child_process_1.spawn('open', [url]);
    return Promise.resolve();
};
var runToCompletion = function (directory, command, onOutput, onError) {
    return new Promise(function (resolve) {
        var childProcess = child_process_1.exec(command, { cwd: directory });
        childProcess.stdout.on('data', function (data) {
            if (onOutput) {
                var output = trim(data);
                if (output) {
                    onOutput(output);
                }
            }
        });
        childProcess.stderr.on('data', function (data) {
            if (onError) {
                var error = trim(data);
                if (error) {
                    onError(error);
                }
            }
        });
        childProcess.on('error', function (error) {
            if (onError) {
                onError(error.toString());
            }
        });
        childProcess.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                resolve();
                return [2 /*return*/];
            });
        }); });
    });
};
var runUntilStopped = function (directory, command, onOutput, onError) {
    return new Promise(function (resolve) {
        var started = false;
        var stopped = false;
        var commandParts = command.split(' ');
        var childProcess = child_process_1.spawn(commandParts[0], commandParts.slice(1), {
            cwd: directory,
        });
        var start = function () {
            if (!started) {
                started = true;
                setTimeout(function () {
                    resolve(function () {
                        return new Promise(function (resolveStop) {
                            if (stopped) {
                                resolveStop();
                            }
                            else {
                                childProcess.on('close', function () {
                                    resolveStop();
                                });
                                childProcess.kill('SIGHUP');
                            }
                        });
                    });
                }, 1000);
            }
        };
        childProcess.stdout.on('data', function (data) {
            if (onOutput) {
                var output = trim(data);
                if (output) {
                    onOutput(output);
                }
            }
            start();
        });
        childProcess.stderr.on('data', function (data) {
            if (onError) {
                var error = trim(data);
                if (error) {
                    onError(error);
                }
            }
            start();
        });
        childProcess.on('error', function (error) {
            if (onError) {
                onError(error.toString());
            }
        });
        childProcess.on('close', function () { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                stopped = true;
                return [2 /*return*/];
            });
        }); });
    });
};
var ProcessSystem = {
    getCommandLineArgs: getCommandLineArgs,
    getCurrentWorkingDirectory: getCurrentWorkingDirectory,
    log: log,
    open: open,
    runToCompletion: runToCompletion,
    runUntilStopped: runUntilStopped,
};
exports.default = ProcessSystem;
//# sourceMappingURL=ProcessSystem.js.map