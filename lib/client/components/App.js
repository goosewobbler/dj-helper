"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
// import ComponentDetailsContainer from '../containers/ComponentDetailsContainer';
// import ComponentListContainer from '../containers/ComponentListContainer';
// import ComponentListFilterContainer from '../containers/ComponentListFilterContainer';
// import UpdateBar from '../containers/UpdateBarContainer';
// import CreateForm from './CreateForm';
// import Dialog from './Dialog';
var ExternalLink_1 = require("./ExternalLink");
var GitHubLink_1 = require("./GitHubLink");
var App = function (props) { return (React.createElement("div", { className: "container" },
    React.createElement("div", { className: "header" },
        React.createElement("h1", { className: "title" }, "Morph Developer Console"),
        React.createElement("div", { className: "header-links" },
            React.createElement(ExternalLink_1.default, { link: "https://ci.sport.tools.bbc.co.uk/view/morph-module-pipeline/", label: "INT Pipeline", black: true }),
            React.createElement(ExternalLink_1.default, { link: "https://ci.sport.tools.bbc.co.uk/view/morph-module-test-pipeline//", label: "TEST Pipeline", black: true }),
            React.createElement(ExternalLink_1.default, { link: "https://ci.sport.tools.bbc.co.uk/view/morph-module-live-pipeline//", label: "LIVE Pipeline", black: true }),
            React.createElement(GitHubLink_1.default, { link: "https://github.com/bbc/morph-developer-console" }))),
    React.createElement("div", { className: "content" }, "Weeeeeeeeeeeeee"))); };
exports.default = App;
//# sourceMappingURL=App.js.map