"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ComponentState_1 = require("../../types/ComponentState");
var ListItemButton_1 = require("../styled/ListItemButton");
var ExternalLink_1 = require("./ExternalLink");
var IconButton_1 = require("./IconButton");
var createID = function (componentName) { return "component-list-item-" + componentName; };
var backgroundColorForState = function (state) {
    switch (state) {
        case ComponentState_1.default.Linking:
        case ComponentState_1.default.Starting:
            return 'orange';
        case ComponentState_1.default.Installing:
            return 'rgb(255, 90, 90)';
        case ComponentState_1.default.Building:
            return '#cb75ff';
        case ComponentState_1.default.Running:
            return '#baecff';
        default:
            break;
    }
    return 'white';
};
var renderFavouriteButton = function (props) {
    if (props.component.favorite) {
        return (React.createElement(IconButton_1.default, { className: "unfavorite-button", label: "Unfavorite", image: "/image/icon/favourited.svg", onClick: function () { return props.onToggleFavourite(); } }));
    }
    return (React.createElement(IconButton_1.default, { className: "favorite-button", label: "Favorite", image: "/image/icon/unfavourited.svg", onClick: function () { return props.onToggleFavourite(); } }));
};
var renderLaunchButton = function (component) {
    var link = "" + component.url + (Array.isArray(component.history) && component.history.length > 0
        ? component.history[0]
        : '');
    if (component.state === ComponentState_1.default.Running) {
        return (React.createElement(ExternalLink_1.default, { className: "launch-button", label: "Launch", link: link, color: "#2491c8", height: "21", padding: "0 4px" }));
    }
    return null;
};
var renderStartStopButton = function (props) {
    switch (props.component.state) {
        case ComponentState_1.default.Stopped:
            return (React.createElement(IconButton_1.default, { className: "start-button", label: "Start", image: "/image/icon/gel-icon-play.svg", onClick: props.onStart }));
        case ComponentState_1.default.Installing:
            return React.createElement(IconButton_1.default, { label: "Installing", loading: true });
        case ComponentState_1.default.Building:
            return React.createElement(IconButton_1.default, { label: "Building", loading: true });
        case ComponentState_1.default.Linking:
            return React.createElement(IconButton_1.default, { label: "Linking", loading: true });
        case ComponentState_1.default.Starting:
            return React.createElement(IconButton_1.default, { label: "Starting", loading: true });
        case ComponentState_1.default.Running:
            return (React.createElement(IconButton_1.default, { className: "stop-button", label: "Stop", image: "/image/icon/gel-icon-pause.svg", onClick: props.onStop }));
    }
};
var ComponentListItem = /** @class */ (function (_super) {
    __extends(ComponentListItem, _super);
    function ComponentListItem() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ComponentListItem.prototype.shouldComponentUpdate = function (nextProps) {
        if (this.props.component !== nextProps.component) {
            return true;
        }
        if (this.props.selected !== nextProps.selected) {
            return true;
        }
        return false;
    };
    ComponentListItem.prototype.render = function () {
        var name = this.props.component.highlighted && this.props.component.highlighted.length > 0
            ? this.props.component.highlighted
            : this.props.component.displayName;
        return (React.createElement(ListItemButton_1.default, { role: "button", id: createID(this.props.component.name), backgroundColor: backgroundColorForState(this.props.component.state), highlighted: this.props.selected, onClick: this.props.onClick },
            renderFavouriteButton(this.props),
            React.createElement("span", { className: "component-name-label" }, name),
            renderLaunchButton(this.props.component),
            renderStartStopButton(this.props)));
    };
    return ComponentListItem;
}(React.PureComponent));
exports.default = ComponentListItem;
//# sourceMappingURL=ComponentListItem.js.map