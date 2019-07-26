"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var reducer = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case 'RECEIVE_EDITORS': {
            return __assign({}, state, { editors: action.editors });
        }
        case 'SELECT_COMPONENT': {
            return __assign({}, state, { selectedComponent: action.name });
        }
        case 'FILTER_COMPONENTS': {
            return __assign({}, state, { filter: action.filter });
        }
        case 'UPDATE_AVAILABLE': {
            return __assign({}, state, { outOfDate: true });
        }
        case 'UPDATING': {
            return __assign({}, state, { updated: false, updating: true });
        }
        case 'UPDATED': {
            return __assign({}, state, { updated: true, updating: false });
        }
        case 'SHOW_CREATE_DIALOG': {
            return __assign({}, state, { showCreateDialog: action.show });
        }
        default:
            return state;
    }
};
exports.default = reducer;
//# sourceMappingURL=ui.js.map