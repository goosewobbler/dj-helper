"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var react_redux_1 = require("react-redux");
var components_1 = require("../actions/components");
var ComponentList_1 = require("../components/ComponentList");
var resultsHelper_1 = require("../helpers/resultsHelper");
var getSortedComponents = function (components) {
    return components.sort(function (mA, mB) {
        if (mA.favorite && !mB.favorite) {
            return -1;
        }
        else if (!mA.favorite && mB.favorite) {
            return 1;
        }
        return mA.name.localeCompare(mB.name);
    });
};
var getFilteredComponents = function (components, filter) {
    var componentsWithAlternatives = components.map(function (component) {
        return fp_1.assign(component, {
            alternatives: [component.displayName.replace(/-/g, ' ')],
        });
    });
    var results = resultsHelper_1.default(componentsWithAlternatives, filter);
    if (results.length > 50) {
        return results.slice(0, 50);
    }
    return results;
};
var getComponents = function (components, filter) {
    if (filter) {
        return getFilteredComponents(components, filter);
    }
    return getSortedComponents(components);
};
var mapStateToProps = function (state) {
    var filter = state.ui.filter;
    return {
        components: getComponents(state.components, filter),
        filter: filter,
        selectedComponent: state.ui.selectedComponent,
    };
};
var mapDispatchToProps = function (dispatch) { return ({
    onFavouriteComponent: function (component, favorite) {
        return dispatch(components_1.favouriteComponent(component.name, favorite));
    },
    onSelectComponent: function (component) { return dispatch(components_1.updateAndSelectComponent(component.name)); },
    onStartComponent: function (name) { return dispatch(components_1.startComponent(name)); },
    onStopComponent: function (name) { return dispatch(components_1.stopComponent(name)); },
}); };
var Container = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(ComponentList_1.default);
exports.default = Container;
//# sourceMappingURL=ComponentListContainer.js.map