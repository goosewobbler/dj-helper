"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ComponentDetailsSection = function (props) { return (React.createElement("div", null,
    React.createElement("div", { className: "header" },
        React.createElement("h3", { className: "label" }, props.label),
        props.end),
    React.createElement("div", { className: "content" }, props.children))); };
exports.default = ComponentDetailsSection;
//# sourceMappingURL=ComponentDetailsSection.js.map