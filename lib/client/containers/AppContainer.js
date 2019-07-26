"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var components_1 = require("../actions/components");
var App_1 = require("../components/App");
var mapDispatchToProps = function (dispatch) { return ({
    showCreateDialog: function (show) {
        dispatch(components_1.showCreateDialog(show));
    },
    submitModule: function (name, description, type) {
        dispatch(components_1.createModule(name, description, type));
    },
}); };
var mapStateToProps = function (state) { return ({
    shouldShowCreateDialog: state.ui.showCreateDialog,
}); };
var Container = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(App_1.default);
exports.default = Container;
//# sourceMappingURL=AppContainer.js.map