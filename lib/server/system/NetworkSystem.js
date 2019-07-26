"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var get = function (url) {
    return new Promise(function (resolve, reject) {
        return request.get(url, function (error, response, body) {
            if (error) {
                reject(error);
            }
            else {
                resolve({ body: body, headers: response.headers, statusCode: response.statusCode });
            }
        });
    });
};
var NetworkSystem = {
    get: get,
};
exports.default = NetworkSystem;
//# sourceMappingURL=NetworkSystem.js.map