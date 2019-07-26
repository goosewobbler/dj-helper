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
var glamorous_1 = require("glamorous");
var React = require("react");
var LabelButton_1 = require("./LabelButton");
var KEY_ENTER = 13;
var KEY_ESCAPE = 27;
var ContainingDiv = glamorous_1.default.div({
    display: 'flex',
    flexDirection: 'column',
});
var InputContainingDiv = glamorous_1.default.div({
    alignItems: 'center',
    display: 'flex',
    margin: '8px 0',
});
var InputLabel = glamorous_1.default.label({
    fontSize: '20px',
    marginRight: '8px',
    minWidth: '120px',
});
var TextInputInput = glamorous_1.default.input({
    flexGrow: 1,
    fontSize: '20px',
    height: '32px',
});
var SelectInputSelect = glamorous_1.default.select({
    flexGrow: 1,
    fontSize: '20px',
    height: '32px',
});
var SelectInputOption = glamorous_1.default.option({
    fontSize: '20px',
    height: '32px',
});
var CreateButtonDiv = glamorous_1.default.div({
    marginLeft: 'auto',
    marginTop: '8px',
});
var SelectInput = function (props) { return (React.createElement(InputContainingDiv, null,
    React.createElement(InputLabel, null, props.label),
    React.createElement(SelectInputSelect, { className: props.className, onChange: props.onChange }, props.options.map(function (option) { return (React.createElement(SelectInputOption, { key: option.value, value: option.value }, option.label)); })))); };
var TextInput = function (props) { return (React.createElement(InputContainingDiv, null,
    React.createElement(InputLabel, null, props.label),
    React.createElement(TextInputInput, { className: props.className, type: "text", autoFocus: props.autoFocus, onChange: props.onChange, onKeyDown: props.onKeyDown }))); };
var CreateForm = /** @class */ (function (_super) {
    __extends(CreateForm, _super);
    function CreateForm(props) {
        var _this = _super.call(this, props) || this;
        _this.type = 'viewcss';
        _this.state = {
            valid: false,
        };
        return _this;
    }
    CreateForm.prototype.render = function () {
        var _this = this;
        var options = [
            { label: 'React with Grandstand and Sass', value: 'viewcss' },
            { label: 'React without Grandstand and Sass', value: 'view' },
            { label: 'Data Template', value: 'data' },
        ];
        return (React.createElement(ContainingDiv, null,
            React.createElement(SelectInput, { className: "create-type-select", label: "Type", options: options, onChange: function (event) { return _this.handleTypeChange(event); } }),
            React.createElement(TextInput, { label: "Name", className: "create-name-input", autoFocus: true, onChange: function (event) { return _this.handleNameChange(event); }, onKeyDown: function (event) { return _this.handleKeyDown(event); } }),
            React.createElement(TextInput, { label: "Description", className: "create-description-input", autoFocus: false, onChange: function (event) { return _this.handleDescriptionChange(event); }, onKeyDown: function (event) { return _this.handleKeyDown(event); } }),
            React.createElement(CreateButtonDiv, null,
                React.createElement(LabelButton_1.default, { className: "create-create-button", label: "Create", disabled: !this.state.valid, onClick: function () { return _this.create(); } }))));
    };
    CreateForm.prototype.create = function () {
        this.props.submitModule(this.name, this.description, this.type);
    };
    CreateForm.prototype.updateValid = function () {
        this.setState({
            valid: Boolean(this.name && this.description && this.type),
        });
    };
    CreateForm.prototype.handleNameChange = function (event) {
        this.name = event.target.value;
        this.updateValid();
    };
    CreateForm.prototype.handleDescriptionChange = function (event) {
        this.description = event.target.value;
        this.updateValid();
    };
    CreateForm.prototype.handleTypeChange = function (event) {
        this.type = event.target.value;
        this.updateValid();
    };
    CreateForm.prototype.handleKeyDown = function (event) {
        if (event.keyCode === KEY_ENTER) {
            if (this.state.valid) {
                this.create();
            }
        }
        else if (event.keyCode === KEY_ESCAPE) {
            this.props.onClose();
        }
    };
    return CreateForm;
}(React.Component));
exports.default = CreateForm;
//# sourceMappingURL=CreateForm.js.map