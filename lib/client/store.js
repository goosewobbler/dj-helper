"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var redux_thunk_1 = require("redux-thunk");
var combined_1 = require("./reducers/combined");
var createDefaultState = function () { return ({
    components: [],
    ui: {
        editors: [],
    },
}); };
var store = function (initialState) {
    return redux_1.createStore(combined_1.default, initialState || createDefaultState(), redux_1.applyMiddleware(redux_thunk_1.default));
};
exports.default = store;
//# sourceMappingURL=store.js.map