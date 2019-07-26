"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ComponentState_1 = require("../../types/ComponentState");
var ExternalLink_1 = require("./ExternalLink");
var LabelButton_1 = require("./LabelButton");
var renderStateLabel = function (state) {
    switch (state) {
        case ComponentState_1.default.Stopped:
            return 'NOT RUNNING';
        case ComponentState_1.default.Building:
            return 'BUILDING';
        case ComponentState_1.default.Installing:
            return 'INSTALLING';
        case ComponentState_1.default.Linking:
            return 'LINKING';
        case ComponentState_1.default.Starting:
            return 'STARTING';
        case ComponentState_1.default.Running:
            return 'RUNNING';
    }
};
var renderUseCacheButton = function (props) {
    if (props.component.state === ComponentState_1.default.Stopped || props.component.state === ComponentState_1.default.Running) {
        return (React.createElement("div", { className: "item-wrapper" },
            React.createElement(LabelButton_1.default, { backgroundColor: props.component.useCache ? '#c9ffc9' : 'transparent', className: props.component.useCache ? 'no-use-cache-button' : 'use-cache-button', label: "Cache", onClick: function () { return props.onSetUseCache(props.component.name, !props.component.useCache); } })));
    }
    return null;
};
var renderBuildButton = function (props) {
    if (props.component.state === ComponentState_1.default.Running) {
        return (React.createElement("div", { className: "item-wrapper" },
            React.createElement(LabelButton_1.default, { className: "build-button", label: "Build", onClick: function () { return props.onBuild(props.component.name); } })));
    }
    return null;
};
var renderInstallButton = function (props) {
    if (props.component.state === ComponentState_1.default.Stopped || props.component.state === ComponentState_1.default.Running) {
        return (React.createElement("div", { className: "item-wrapper" },
            React.createElement(LabelButton_1.default, { className: "install-button", label: "Reinstall", onClick: function () { return props.onInstall(props.component.name); } })));
    }
    return null;
};
var ComponentActions = function (props) { return (React.createElement("div", { className: "container" },
    React.createElement("div", { className: "header" },
        React.createElement("h2", { className: "name" }, props.component.displayName),
        React.createElement("p", { className: "state-label" }, renderStateLabel(props.component.state))),
    React.createElement("div", { className: "actions" },
        renderUseCacheButton(props),
        renderBuildButton(props),
        renderInstallButton(props),
        props.editors.indexOf('code') !== -1 ? (React.createElement("div", { className: "item-wrapper", key: "vs-code-button" },
            React.createElement(LabelButton_1.default, { className: "vs-code-button", label: "VS Code", image: "/image/icon/vscode-logo.svg", onClick: function () { return props.onOpenInCode(props.component.name); } }))) : null,
        React.createElement("div", { className: "item-wrapper" },
            React.createElement(ExternalLink_1.default, { label: "Dependency Graph", link: "https://morph-dependency-grapher.test.api.bbc.co.uk/env/test/modules/" + props.component.displayName, black: true })),
        React.createElement("div", { className: "item-wrapper" },
            React.createElement(ExternalLink_1.default, { label: "GitHub", link: "https://github.com/bbc/morph-modules/tree/master/" + props.component.displayName, black: true }))))); };
exports.default = ComponentActions;
//# sourceMappingURL=ComponentActions.js.map