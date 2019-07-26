"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ExternalLink = function (props) { return (React.createElement("a", { className: props.className, href: props.link, target: "_blank", color: props.color, onClick: function (event) { return event.stopPropagation(); } },
    React.createElement("img", { alt: "external link", src: "/image/icon/gel-icon-external-link-" + (props.black ? 'black' : 'white') + ".svg" }),
    React.createElement("span", null, props.label))); };
exports.default = ExternalLink;
//# sourceMappingURL=ExternalLink.js.map