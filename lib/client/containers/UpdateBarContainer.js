"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var UpdateBar_1 = require("../components/UpdateBar");
var components_1 = require("../actions/components");
var mapStateToProps = function (state) { return ({
    outOfDate: state.ui.outOfDate,
    updated: state.ui.updated,
    updating: state.ui.updating,
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onUpdate: function () { return dispatch(components_1.update()); },
}); };
var Container = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(UpdateBar_1.default);
exports.default = Container;
//# sourceMappingURL=UpdateBarContainer.js.map