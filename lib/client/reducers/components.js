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
    if (state === void 0) { state = []; }
    switch (action.type) {
        case 'CREATE_COMPONENT': {
            return state.concat([{ name: action.name, displayName: action.displayName }]);
        }
        case 'RECEIVE_COMPONENTS': {
            return action.components;
        }
        case 'RECEIVE_COMPONENT': {
            return state.filter(function (component) { return component.name !== action.component.name; }).concat(action.component);
        }
        case 'CHANGE_COMPONENT_STATE': {
            return state.map(function (component) {
                if (component.name === action.name) {
                    return __assign({}, component, { state: action.state });
                }
                return component;
            });
        }
        case 'LINKING_COMPONENT': {
            return state.map(function (component) {
                if (component.name === action.name) {
                    return __assign({}, component, { linking: [action.dependency] });
                }
                return component;
            });
        }
        case 'PROMOTING_COMPONENT': {
            return state.map(function (component) {
                if (component.name === action.name) {
                    return __assign({}, component, { promoting: action.environment });
                }
                return component;
            });
        }
        case 'FAVORITE_COMPONENT': {
            return state.map(function (component) {
                if (component.name === action.name) {
                    return __assign({}, component, { favorite: action.favorite });
                }
                return component;
            });
        }
        default:
            return state;
    }
};
exports.default = reducer;
//# sourceMappingURL=components.js.map