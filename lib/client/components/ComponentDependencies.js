"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ComponentState_1 = require("../../types/ComponentState");
var ComponentDependency_1 = require("./ComponentDependency");
var orderDependencies = function (dependencies) {
    return (dependencies || []).sort(function (a, b) { return a.displayName.localeCompare(b.displayName); });
};
var isLinked = function (depenencyName, component) {
    return component.dependencies.find(function (d) { return d.name === depenencyName; }).linked;
};
var isLinking = function (depenency, component) { return (component.linking || []).indexOf(depenency) > -1; };
var renderDependencies = function (props, dependencies) {
    return dependencies.map(function (dependency) { return (React.createElement("li", { key: dependency.name },
        React.createElement(ComponentDependency_1.default, { dependency: dependency.displayName, latest: dependency.latest, has: dependency.has, version: dependency.version, outdated: dependency.outdated, linked: isLinked(dependency.name, props.component), linking: isLinking(dependency.name, props.component), linkableState: props.component.state === ComponentState_1.default.Running, onClick: function () { return props.onSelectComponent(dependency.name); }, onLinkComponent: function () { return props.onLinkComponent(props.component.name, dependency.name); }, onUnlinkComponent: function () { return props.onUnlinkComponent(props.component.name, dependency.name); } }))); });
};
var ComponentDependencies = function (props) { return (React.createElement("ul", null, renderDependencies(props, orderDependencies(props.component.dependencies)))); };
exports.default = ComponentDependencies;
//# sourceMappingURL=ComponentDependencies.js.map