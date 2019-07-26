"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ListItemButton_1 = require("../styled/ListItemButton");
var VersionBox_1 = require("../ui/VersionBox");
var LabelButton_1 = require("./LabelButton");
var getBackgroundColour = function (props) {
    if (props.linking) {
        return 'orange';
    }
    else if (props.linked) {
        return '#c9ffc9';
    }
    return 'white';
};
var renderLinkButton = function (props) {
    if (props.linking) {
        return (React.createElement("div", { className: "loading" },
            React.createElement("img", { src: "/image/icon/gel-icon-loading.svg" })));
    }
    if (!props.linkableState) {
        return null;
    }
    var className = props.linked ? 'component-unlink-button' : 'component-link-button';
    var label = props.linked ? 'Unlink' : 'Link';
    var onClick = props.linked ? props.onUnlinkComponent : props.onLinkComponent;
    return (React.createElement(LabelButton_1.default, { className: className, label: label, padding: "0 4px", fontSize: "12px", height: "24px", width: "50px", onClick: onClick, backgroundColor: "white" }));
};
var renderVersionBox = function (version, outdated) { return (React.createElement(VersionBox_1.default, { version: version, bad: outdated, fontSize: "14px", height: "24px", width: "60px", padding: "0 4px" })); };
var ComponentDependency = function (props) { return (React.createElement(ListItemButton_1.default, { className: "component-dependency", backgroundColor: getBackgroundColour(props), onClick: props.onClick },
    React.createElement("span", { className: "component-name-label" }, props.dependency),
    renderLinkButton(props),
    renderVersionBox(props.version, props.outdated),
    renderVersionBox(props.has, props.has && props.latest && props.has !== props.latest),
    renderVersionBox(props.latest, false))); };
exports.default = ComponentDependency;
//# sourceMappingURL=ComponentDependency.js.map