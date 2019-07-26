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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ScrollList_1 = require("../ui/ScrollList");
var ComponentListItem_1 = require("./ComponentListItem");
var ComponentList = /** @class */ (function (_super) {
    __extends(ComponentList, _super);
    function ComponentList(props) {
        var _this = _super.call(this, props) || this;
        _this.renderListItem = _this.renderListItem.bind(_this);
        return _this;
    }
    ComponentList.prototype.render = function () {
        var _this = this;
        var selectedIndex = this.props.components.findIndex(function (component) { return component.name === _this.props.selectedComponent; });
        return (React.createElement(ScrollList_1.default, { length: this.props.components.length, selectedID: this.props.selectedComponent, selectedIndex: selectedIndex, renderListItem: this.renderListItem }));
    };
    ComponentList.prototype.renderListItem = function (index, key) {
        var _this = this;
        var component = this.props.components[index];
        return (React.createElement(ComponentListItem_1.default, { key: key, component: component, selected: true && component.name === this.props.selectedComponent, onClick: function () { return _this.props.onSelectComponent(component); }, onToggleFavourite: function () { return _this.props.onFavouriteComponent(component, !component.favorite); }, onStart: function () { return _this.props.onStartComponent(component.name); }, onStop: function () { return _this.props.onStopComponent(component.name); } }));
    };
    return ComponentList;
}(React.Component));
var ComponentListAdapter = function (props) { return React.createElement(ComponentList, __assign({}, props)); };
exports.default = ComponentListAdapter;
//# sourceMappingURL=ComponentList.js.map