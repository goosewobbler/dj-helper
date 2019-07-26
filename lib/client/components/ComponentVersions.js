"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fp_1 = require("lodash/fp");
var React = require("react");
var semver_1 = require("semver");
var BumpConnector = function (props) {
    var onClick = props.bumping ? null : props.bump;
    return (React.createElement("div", { className: "connector" },
        React.createElement("button", { className: "bump-button", onClick: onClick }, props.bumping ? React.createElement("span", null, "Bumping") : 'Bump')));
};
var PromoteConnector = function (props) {
    if (props.promote) {
        var onClick = props.promoting ? null : props.promote;
        return (React.createElement("div", { className: "connector" },
            React.createElement("button", { className: "promote-button", "data-test": props.environment, onClick: onClick }, props.promoting ? React.createElement("span", null, "Promoting") : 'Promote')));
    }
    return React.createElement("div", { className: "connector" });
};
var Environment = function (props) {
    if (props.version === null) {
        return (React.createElement("div", { className: "environment-loading" },
            React.createElement("img", { src: "/image/icon/gel-icon-loading-white.svg" })));
    }
    return (React.createElement("div", { "data-test": props.current, className: "environment-version" },
        React.createElement("p", { className: "version-label" }, props.version || 'N/A'),
        React.createElement("p", { className: "environment-label" }, props.label)));
};
var ComponentVersions = function (props) {
    var rawVersions = props.component.versions || { local: null, int: null, test: null, live: null };
    var versions = {
        int: rawVersions.int === '' ? rawVersions.int : semver_1.valid(rawVersions.int),
        live: rawVersions.live === '' ? rawVersions.live : semver_1.valid(rawVersions.live),
        local: semver_1.valid(rawVersions.local),
        test: rawVersions.test === '' ? rawVersions.test : semver_1.valid(rawVersions.test),
    };
    var localUpToDate = !versions.local || !versions.int || semver_1.gte(versions.local, versions.int);
    var latestVersion = localUpToDate ? versions.local : versions.int;
    var intCurrent = Boolean(versions.int && versions.local && semver_1.gte(versions.int, versions.local));
    var testCurrent = Boolean(latestVersion && versions.test && semver_1.gte(versions.test, latestVersion));
    var liveCurrent = Boolean(latestVersion && versions.live && semver_1.gte(versions.live, latestVersion));
    var bumping = props.component.promoting === 'int';
    var promotingINT = props.component.promoting === 'test';
    var promotingTEST = props.component.promoting === 'live';
    var showPromoteINT = versions.int && versions.test !== null && !promotingTEST && (!versions.test || semver_1.lt(versions.test, versions.int));
    var showPromoteTEST = versions.test && versions.live !== null && !promotingINT && (!versions.live || semver_1.lt(versions.live, versions.test));
    var bumpAction = function () { return props.onBumpComponent(props.component.name, 'patch'); };
    var promoteToTestAction = showPromoteINT ? function () { return props.onPromoteComponent(props.component.name, 'test'); } : null;
    var promoteToLiveAction = showPromoteTEST ? function () { return props.onPromoteComponent(props.component.name, 'live'); } : null;
    var failure = props.component.promotionFailure;
    var failureElement = fp_1.startsWith('http', failure) ? (React.createElement("a", { className: "failure", href: failure, target: "_blank" }, failure)) : (failure);
    var promotionFailure = failure ? (React.createElement("p", { className: "promotion-failure" },
        React.createElement("span", { role: "img", "aria-label": "Anguished face" }, "\uD83D\uDE27"),
        "\u00A0 Promotion failed:\u00A0",
        failureElement)) : null;
    return (React.createElement("div", null,
        promotionFailure,
        React.createElement("div", { className: "environment" },
            React.createElement(Environment, { label: "LOCAL", version: versions.local, current: localUpToDate }),
            React.createElement(BumpConnector, { bumping: bumping, bump: bumpAction }),
            React.createElement(Environment, { label: "INT", version: versions.int, current: intCurrent }),
            React.createElement(PromoteConnector, { environment: "test", promoting: promotingINT, promote: promoteToTestAction }),
            React.createElement(Environment, { label: "TEST", version: versions.test, current: testCurrent }),
            React.createElement(PromoteConnector, { environment: "live", promoting: promotingTEST, promote: promoteToLiveAction }),
            React.createElement(Environment, { label: "LIVE", version: versions.live, current: liveCurrent }))));
};
exports.default = ComponentVersions;
//# sourceMappingURL=ComponentVersions.js.map