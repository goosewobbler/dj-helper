"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var ComponentListFilter_1 = require("../components/ComponentListFilter");
var components_1 = require("../actions/components");
var mapStateToProps = function (state) { return ({}); };
var mapDispatchToProps = function (dispatch) { return ({
    onInput: function (filter) { return dispatch(components_1.filterComponents(filter)); },
}); };
var Container = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ComponentListFilter_1.default);
exports.default = Container;
//# sourceMappingURL=ComponentListFilterContainer.js.map