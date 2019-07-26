"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var getMessage = function (props) {
    if (props.updating) {
        return 'Updating  😟';
    }
    else if (props.updated) {
        return 'Morph Developer Console updated sucessfully  🎉  Restart to apply updates.';
    }
    return [
        React.createElement("span", { key: "update-message-1" }, "There is an update available for the Morph Developer Console. See "),
        React.createElement("a", { key: "update-message-link", target: "_blank", href: "https://github.com/bbc/morph-developer-console/blob/master/docs/whats-new.md" }, "what's new"),
        React.createElement("span", { key: "update-message-2" }, ". \uD83D\uDC40"),
    ];
};
var renderButton = function (props) {
    if (props.updating) {
        return React.createElement("img", { src: "/image/icon/gel-icon-loading-white.svg" });
    }
    else if (props.updated) {
        return null;
    }
    return (React.createElement("button", { className: "update-button", onClick: props.onUpdate }, "Update"));
};
var UpdateBar = function (props) {
    return props.outOfDate ? (React.createElement("div", { className: "update-bar" },
        React.createElement("h1", { className: "update-header" }, getMessage(props)),
        renderButton(props))) : null;
};
exports.default = UpdateBar;
//# sourceMappingURL=UpdateBar.js.map