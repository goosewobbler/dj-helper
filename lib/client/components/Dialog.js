"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var glamorous_1 = require("glamorous");
var React = require("react");
var LabelButton_1 = require("./LabelButton");
var ContainingDiv = glamorous_1.default.div({
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    bottom: 0,
    display: 'flex',
    justifyContent: 'center',
    left: 0,
    position: 'fixed',
    right: 0,
    top: 0,
});
var BoxDiv = glamorous_1.default.div({
    backgroundColor: 'white',
    borderRadius: '2px',
    boxShadow: '0 0 15px 5px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '750px',
    padding: '16px',
    width: '95%',
});
var HeaderDiv = glamorous_1.default.div({
    alignItems: 'center',
    display: 'flex',
    marginBottom: '16px',
});
var CloseButtonDiv = glamorous_1.default.div({});
var ContentDiv = glamorous_1.default.div({});
var TitleH1 = glamorous_1.default.h1({
    fontFamily: 'Arial',
    fontSize: '28px',
    fontWeight: 'normal',
    marginRight: 'auto',
});
var Dialog = function (props) { return (React.createElement(ContainingDiv, { className: "dialog" },
    React.createElement(BoxDiv, null,
        React.createElement(HeaderDiv, null,
            React.createElement(TitleH1, null, props.title),
            React.createElement(CloseButtonDiv, null,
                React.createElement(LabelButton_1.default, { className: "dialog-close-button", width: "100%", image: "/image/icon/no.svg", label: "", onClick: props.onClose }))),
        React.createElement(ContentDiv, null, props.children)))); };
exports.default = Dialog;
//# sourceMappingURL=Dialog.js.map