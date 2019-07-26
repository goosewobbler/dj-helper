"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glamorous_1 = require("glamorous");
var Spacer = glamorous_1.default.div({
    flexShrink: 0,
}, function (props) { return ({
    flexBasis: (props.space || 8) + "px",
    flexGrow: props.fill ? 1 : 0,
}); });
exports.default = Spacer;
//# sourceMappingURL=Spacer.js.map