"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_redux_1 = require("react-redux");
var components_1 = require("../actions/components");
var ComponentDetails_1 = require("../components/ComponentDetails");
var getSelectedComponent = function (state) {
    var found = null;
    if (state.ui && state.ui.selectedComponent) {
        state.components.forEach(function (component) {
            if (component.name === state.ui.selectedComponent) {
                found = component;
            }
        });
    }
    return found;
};
var mapStateToProps = function (state) { return ({
    component: getSelectedComponent(state),
    editors: state.ui.editors,
}); };
var mapDispatchToProps = function (dispatch) { return ({
    onBuild: function (name) { return dispatch(components_1.buildComponent(name)); },
    onBumpComponent: function (name, type) { return dispatch(components_1.bumpComponent(name, type)); },
    onInstall: function (name) { return dispatch(components_1.installComponent(name)); },
    onLinkComponent: function (name, dependency) { return dispatch(components_1.linkComponent(name, dependency)); },
    onOpenInCode: function (name) { return dispatch(components_1.openInCode(name)); },
    onPromoteComponent: function (name, environment) { return dispatch(components_1.promoteComponent(name, environment)); },
    onSelectComponent: function (name) { return dispatch(components_1.updateAndSelectComponent(name)); },
    onSetUseCache: function (name, value) { return dispatch(components_1.setUseCacheOnComponent(name, value)); },
    onUnlinkComponent: function (name, dependency) { return dispatch(components_1.unlinkComponent(name, dependency)); },
}); };
var Container = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ComponentDetails_1.default);
exports.default = Container;
//# sourceMappingURL=ComponentDetailsContainer.js.map