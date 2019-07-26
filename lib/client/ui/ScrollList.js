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
var fp_1 = require("lodash/fp");
var React = require("react");
var ReactList = require("react-list");
var ReactListComponent = ReactList;
var ComponentList = /** @class */ (function (_super) {
    __extends(ComponentList, _super);
    function ComponentList(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            showScrollToTop: false,
        };
        _this.handleListRef = _this.handleListRef.bind(_this);
        _this.handleScrollToTheTop = _this.handleScrollToTheTop.bind(_this);
        _this.handleScroll = fp_1.throttle(200, _this.handleScroll.bind(_this));
        return _this;
    }
    ComponentList.prototype.componentDidUpdate = function (prevProps) {
        if (this.listElement &&
            typeof this.props.selectedIndex === 'number' &&
            prevProps.selectedID !== this.props.selectedID) {
            var _a = this.listElement.getVisibleRange(), firstIndex = _a[0], lastIndex = _a[1];
            if (this.props.selectedIndex < firstIndex || this.props.selectedIndex > lastIndex) {
                this.listElement.scrollTo(this.props.selectedIndex);
                this.handleScroll();
            }
        }
    };
    ComponentList.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement("ul", { onScroll: this.handleScroll },
                React.createElement(ReactListComponent, { ref: this.handleListRef, itemRenderer: this.props.renderListItem, length: this.props.length, type: "uniform", useStaticSize: true, useTranslate3d: true, minSize: 20 })),
            React.createElement("button", { onClick: this.handleScrollToTheTop })));
    };
    ComponentList.prototype.handleListRef = function (el) {
        this.listElement = el;
    };
    ComponentList.prototype.handleScrollToTheTop = function () {
        if (this.listElement) {
            this.listElement.scrollTo(0);
            this.setState({ showScrollToTop: false });
        }
    };
    ComponentList.prototype.handleScroll = function () {
        if (this.listElement) {
            var firstIndex = this.listElement.getVisibleRange()[0];
            this.setState({ showScrollToTop: firstIndex > 10 });
        }
    };
    return ComponentList;
}(React.Component));
var ComponentListAdapter = function (props) { return React.createElement(ComponentList, __assign({}, props)); };
exports.default = ComponentListAdapter;
//# sourceMappingURL=ScrollList.js.map