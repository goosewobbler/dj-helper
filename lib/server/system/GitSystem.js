"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var crypto_1 = require("crypto");
var ProcessSystem_1 = require("./ProcessSystem");
var checkoutExistingBranch = function (directory, branchName) {
    return ProcessSystem_1.default.runToCompletion(directory, "git checkout " + branchName, function () { return null; }, console.error);
};
var checkoutNewBranch = function (directory, branchName) {
    return ProcessSystem_1.default.runToCompletion(directory, "git checkout -b " + branchName, function () { return null; }, console.error);
};
var commit = function (directory, message) {
    return ProcessSystem_1.default.runToCompletion(directory, "git commit -m \"" + message + "\"", function () { return null; }, console.error);
};
var getCurrentBranch = function (directory) {
    return new Promise(function (resolve, reject) {
        ProcessSystem_1.default.runToCompletion(directory, 'git rev-parse --abbrev-ref HEAD', resolve, reject).catch(reject);
    });
};
var getRandomBranchName = function () {
    return new Promise(function (resolve, reject) {
        crypto_1.randomBytes(4, function (error, buffer) {
            if (error) {
                reject(error);
            }
            else {
                resolve(buffer.toString('hex'));
            }
        });
    });
};
var push = function (directory, branchName) {
    return ProcessSystem_1.default.runToCompletion(directory, "git push origin " + branchName, function () { return null; }, console.error);
};
var readyToCommit = function (directory) {
    return new Promise(function (resolve, reject) {
        ProcessSystem_1.default.runToCompletion(directory, 'git diff --cached --numstat', function (message) {
            resolve(false);
        }, reject)
            .then(function () { return resolve(true); })
            .catch(reject);
    });
};
var stageFile = function (directory, path) {
    return ProcessSystem_1.default.runToCompletion(directory, "git add " + path, function () { return null; }, console.error);
};
var GitSystem = {
    checkoutExistingBranch: checkoutExistingBranch,
    checkoutNewBranch: checkoutNewBranch,
    commit: commit,
    getCurrentBranch: getCurrentBranch,
    getRandomBranchName: getRandomBranchName,
    push: push,
    readyToCommit: readyToCommit,
    stageFile: stageFile,
};
exports.default = GitSystem;
//# sourceMappingURL=GitSystem.js.map