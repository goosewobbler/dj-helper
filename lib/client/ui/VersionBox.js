"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var VersionBox = function (props) {
    var contents = props.version;
    var backgroundColor = '#aaa';
    if (props.version === null) {
        contents = React.createElement("img", { src: "/image/icon/gel-icon-loading-white.svg" });
        backgroundColor = 'orange';
    }
    else if (props.version === '') {
        contents = 'N/A';
    }
    else if (props.bad) {
        backgroundColor = 'red';
    }
    else if (props.good) {
        backgroundColor = '#59bb5d';
    }
    return (React.createElement("div", null, contents));
};
exports.default = VersionBox;
//# sourceMappingURL=VersionBox.js.map