"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ComponentState_1 = require("../../types/ComponentState");
exports.receiveComponents = function (components) { return ({
    components: components,
    type: 'RECEIVE_COMPONENTS',
}); };
exports.receiveComponent = function (component) { return ({
    component: component,
    type: 'RECEIVE_COMPONENT',
}); };
exports.receiveEditors = function (editors) { return ({
    editors: editors,
    type: 'RECEIVE_EDITORS',
}); };
exports.selectComponent = function (name) { return ({
    name: name,
    type: 'SELECT_COMPONENT',
}); };
exports.promotingComponent = function (name, environment) { return ({
    environment: environment,
    name: name,
    type: 'PROMOTING_COMPONENT',
}); };
exports.updateAndSelectComponent = function (name, noHistory) { return function (dispatch) {
    if (!noHistory && window.historyEnabled) {
        window.history.pushState({ name: name }, null, "/component/" + name);
    }
    dispatch(exports.fetchVersions(name));
    dispatch(exports.selectComponent(name));
}; };
exports.startingComponent = function (name) { return ({
    name: name,
    state: ComponentState_1.default.Starting,
    type: 'CHANGE_COMPONENT_STATE',
}); };
exports.stoppingComponent = function (name) { return ({
    name: name,
    state: ComponentState_1.default.Stopped,
    type: 'CHANGE_COMPONENT_STATE',
}); };
exports.installingComponent = function (name) { return ({
    name: name,
    state: ComponentState_1.default.Installing,
    type: 'CHANGE_COMPONENT_STATE',
}); };
exports.buildingComponent = function (name) { return ({
    name: name,
    state: ComponentState_1.default.Building,
    type: 'CHANGE_COMPONENT_STATE',
}); };
exports.linkingComponent = function (name, dependency) { return ({
    dependency: dependency,
    name: name,
    type: 'LINKING_COMPONENT',
}); };
exports.filterComponents = function (filter) { return ({
    filter: filter,
    type: 'FILTER_COMPONENTS',
}); };
exports.startComponent = function (name) { return function (dispatch) {
    dispatch(exports.startingComponent(name));
    fetch("http://localhost:3333/api/component/" + name + "/start", { method: 'POST' });
}; };
exports.stopComponent = function (name) { return function (dispatch) {
    dispatch(exports.stoppingComponent(name));
    fetch("http://localhost:3333/api/component/" + name + "/stop", { method: 'POST' });
}; };
exports.installComponent = function (name) { return function (dispatch) {
    dispatch(exports.installingComponent(name));
    fetch("http://localhost:3333/api/component/" + name + "/install", { method: 'POST' });
}; };
exports.buildComponent = function (name) { return function (dispatch) {
    dispatch(exports.buildingComponent(name));
    fetch("http://localhost:3333/api/component/" + name + "/build", { method: 'POST' });
}; };
exports.setUseCacheOnComponent = function (name, value) { return function (dispatch) {
    fetch("http://localhost:3333/api/component/" + name + "/cache/" + (value ? 'true' : 'false'), { method: 'POST' });
}; };
exports.favouriteComponent = function (name, favorite) { return function (dispatch) {
    dispatch({
        favorite: favorite,
        name: name,
        type: 'FAVORITE_COMPONENT',
    });
    fetch("http://localhost:3333/api/component/" + name + "/favorite/" + favorite, { method: 'POST' });
}; };
exports.fetchVersions = function (name) { return function () {
    fetch("http://localhost:3333/api/component/" + name + "/versions", { method: 'POST' });
}; };
exports.bumpComponent = function (name, type) { return function (dispatch) {
    dispatch(exports.promotingComponent(name, 'int'));
    fetch("http://localhost:3333/api/component/" + name + "/bump/" + type, { method: 'POST' }).then(function (response) {
        dispatch(exports.promotingComponent(name, null));
    });
}; };
exports.promoteComponent = function (name, environment) { return function (dispatch) {
    dispatch(exports.promotingComponent(name, environment));
    fetch("http://localhost:3333/api/component/" + name + "/promote/" + environment, { method: 'POST' });
}; };
exports.openInCode = function (name) { return function (dispatch) {
    fetch("http://localhost:3333/api/component/" + name + "/edit", { method: 'POST' });
}; };
exports.linkComponent = function (name, dependency) { return function (dispatch) {
    dispatch(exports.linkingComponent(name, dependency));
    fetch("http://localhost:3333/api/component/" + name + "/link/" + dependency, { method: 'POST' });
}; };
exports.unlinkComponent = function (name, dependency) { return function (dispatch) {
    dispatch(exports.linkingComponent(name, dependency));
    fetch("http://localhost:3333/api/component/" + name + "/unlink/" + dependency, { method: 'POST' });
}; };
exports.updateAvailable = function () { return ({
    type: 'UPDATE_AVAILABLE',
}); };
exports.updating = function () { return ({
    type: 'UPDATING',
}); };
exports.updated = function () { return ({
    type: 'UPDATED',
}); };
exports.update = function () { return function (dispatch) {
    dispatch(exports.updating());
    fetch("http://localhost:3333/api/update", { method: 'POST' });
}; };
exports.showCreateDialog = function (show) { return ({
    show: show,
    type: 'SHOW_CREATE_DIALOG',
}); };
exports.createComponent = function (name, displayName) { return ({
    displayName: displayName,
    name: name,
    type: 'CREATE_COMPONENT',
}); };
exports.createModule = function (name, description, type) { return function (dispatch) {
    dispatch(exports.showCreateDialog(false));
    fetch("http://localhost:3333/api/component/create/" + type, {
        body: JSON.stringify({ name: name, description: description }),
        headers: {
            'Content-Type': 'application/json',
        },
        method: 'POST',
    }).then(function () {
        var fullName = "bbc-morph-" + name;
        dispatch(exports.createComponent(fullName, name));
        dispatch(exports.updateAndSelectComponent(fullName));
        dispatch(exports.installComponent(fullName));
    });
}; };
//# sourceMappingURL=components.js.map