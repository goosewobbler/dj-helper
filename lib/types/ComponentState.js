"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentState;
(function (ComponentState) {
    ComponentState[ComponentState["Stopped"] = 1] = "Stopped";
    ComponentState[ComponentState["Starting"] = 2] = "Starting";
    ComponentState[ComponentState["Installing"] = 3] = "Installing";
    ComponentState[ComponentState["Building"] = 4] = "Building";
    ComponentState[ComponentState["Running"] = 5] = "Running";
    ComponentState[ComponentState["Linking"] = 6] = "Linking";
})(ComponentState || (ComponentState = {}));
exports.default = ComponentState;
//# sourceMappingURL=ComponentState.js.map