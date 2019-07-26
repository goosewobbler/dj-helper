"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ComponentActions_1 = require("./ComponentActions");
var ComponentDependencies_1 = require("./ComponentDependencies");
var ComponentDetailsSection_1 = require("./ComponentDetailsSection");
var ComponentVersions_1 = require("./ComponentVersions");
var renderDetailsSectionEnd = function () { return (React.createElement("div", { className: "dependencies-heading" },
    React.createElement("h4", null, "Wants"),
    React.createElement("h4", null, "Bundled"),
    React.createElement("h4", null, "Latest"))); };
var renderDependenciesSection = function (props) {
    if (Array.isArray(props.component.dependencies) && props.component.dependencies.length > 0) {
        return (React.createElement(ComponentDetailsSection_1.default, { label: "Dependencies", grow: 1, end: renderDetailsSectionEnd() },
            React.createElement(ComponentDependencies_1.default, { component: props.component, onSelectComponent: props.onSelectComponent, onLinkComponent: props.onLinkComponent, onUnlinkComponent: props.onUnlinkComponent })));
    }
    return null;
};
var renderDetails = function (props) { return (React.createElement("div", { className: "details" },
    React.createElement("div", { className: "actions" },
        React.createElement(ComponentActions_1.default, { component: props.component, editors: props.editors, onOpenInCode: props.onOpenInCode, onBuild: props.onBuild, onInstall: props.onInstall, onSetUseCache: props.onSetUseCache })),
    React.createElement(ComponentDetailsSection_1.default, { label: "Versions" },
        React.createElement(ComponentVersions_1.default, { component: props.component, onBumpComponent: props.onBumpComponent, onPromoteComponent: props.onPromoteComponent })),
    renderDependenciesSection(props))); };
var renderPlaceholder = function () { return (React.createElement("div", { className: "placeholder" },
    React.createElement("p", null, "No component selected"))); };
var ComponentDetails = function (props) {
    return props.component ? renderDetails(props) : renderPlaceholder();
};
exports.default = ComponentDetails;
//# sourceMappingURL=ComponentDetails.js.map