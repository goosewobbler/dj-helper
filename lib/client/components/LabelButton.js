"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var createClickAction = function (clickAction) { return function (event) {
    event.stopPropagation();
    clickAction();
}; };
var LabelButton = function (props) { return (React.createElement("button", { className: props.className, disabled: props.disabled, onClick: createClickAction(props.onClick) },
    props.image ? React.createElement("img", { src: props.image }) : null,
    React.createElement("p", null, props.label))); };
exports.default = LabelButton;
//# sourceMappingURL=LabelButton.js.map