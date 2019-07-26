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
var renderSearchButton = function () { return (React.createElement("button", { className: "search-btn", key: "search-button" },
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 32 32" },
        React.createElement("path", { d: "M32 28.5l-8.2-8.2c3.4-5.1 2.9-12-1.6-16.4C19.7 1.3 16.3 0 13 0 9.7 0 6.3 1.3 3.8 3.8c-5.1 5.1-5.1 13.3 0 18.4C6.3 24.7 9.7 26 13 26c2.5 0 5.1-.7 7.3-2.2l8.2 8.2 3.5-3.5zM6.6 19.4C4.9 17.7 4 15.4 4 13s.9-4.7 2.6-6.4C8.3 4.9 10.6 4 13 4c2.4 0 4.7.9 6.4 2.6 3.5 3.5 3.5 9.2 0 12.7-1.7 1.7-4 2.6-6.4 2.6s-4.7-.8-6.4-2.5z" })))); };
var renderClearButton = function (onClick) { return (React.createElement("button", { className: "clear-btn", key: "clear-button", onClick: onClick },
    React.createElement("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 32 32" },
        React.createElement("path", { d: "M32 3.5L28.5 0 16 12.5 3.5 0 0 3.5 12.5 16 0 28.5 3.5 32 16 19.5 28.5 32l3.5-3.5L19.5 16z" })))); };
var ComponentListFilter = /** @class */ (function (_super) {
    __extends(ComponentListFilter, _super);
    function ComponentListFilter(props) {
        var _this = _super.call(this, props) || this;
        _this.state = {
            filter: '',
            focussed: false,
        };
        return _this;
    }
    ComponentListFilter.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", null,
            React.createElement("input", { value: this.state.filter, id: "search-input", placeholder: "Search", onKeyDown: function (event) { return _this.onKeyDown(event); }, onFocus: function () { return _this.onFocussed(true); }, onBlur: function () { return _this.onFocussed(false); }, onChange: function (event) { return _this.onInput(event); } }),
            this.renderIcon()));
    };
    ComponentListFilter.prototype.onFocussed = function (focussed) {
        this.setState({
            focussed: focussed,
        });
    };
    ComponentListFilter.prototype.onInput = function (event) {
        this.setState({
            filter: event.target.value,
        });
        this.props.onInput(event.target.value);
    };
    ComponentListFilter.prototype.onKeyDown = function (event) {
        if (event.keyCode === 27) {
            this.clearSearchInput();
        }
    };
    ComponentListFilter.prototype.clearSearchInput = function () {
        this.setState({
            filter: '',
        });
        this.props.onInput('');
    };
    ComponentListFilter.prototype.renderIcon = function () {
        var _this = this;
        return this.state.filter.length > 0 ? renderClearButton(function () { return _this.clearSearchInput(); }) : renderSearchButton();
    };
    return ComponentListFilter;
}(React.Component));
exports.default = ComponentListFilter;
//# sourceMappingURL=ComponentListFilter.js.map