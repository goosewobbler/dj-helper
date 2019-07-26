"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var components_1 = require("./components");
var ui_1 = require("./ui");
var reducer = redux_1.combineReducers({
    components: components_1.default,
    ui: ui_1.default,
});
exports.default = reducer;
//# sourceMappingURL=combined.js.map