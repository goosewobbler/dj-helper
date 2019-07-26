"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createClickAction = function (clickAction) { return function (event) {
    event.stopPropagation();
    clickAction();
}; };
var IconButton = function (props) { return (React.createElement("button", { className: props.className, onClick: createClickAction(props.onClick) },
    React.createElement("img", { src: props.loading ? '/image/icon/gel-icon-loading.svg' : props.image }),
    React.createElement("span", null, props.label))); };
exports.default = IconButton;
//# sourceMappingURL=IconButton.js.map