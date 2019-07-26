"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var CreateType_1 = require("../types/CreateType");
var createTypeMap = {
    data: CreateType_1.default.Data,
    view: CreateType_1.default.View,
    viewcss: CreateType_1.default.ViewCSS,
};
var error = function (ex) {
    console.error(ex.stack);
};
var createApiComponentRouter = function (service) {
    var router = express_1.Router();
    router.get('/', function (req, res) { return res.json(service.getComponentsSummaryData()); });
    router.post('/:name/versions', function (req, res) {
        service.fetchDetails(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/start', function (req, res) {
        service.start(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/stop', function (req, res) {
        service.stop(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/install', function (req, res) {
        service.reinstall(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/build', function (req, res) {
        service.build(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/favorite/:favorite', function (req, res) {
        service.setFavorite(req.params.name, req.params.favorite === 'true').catch(error);
        res.send('🤔');
    });
    router.post('/:name/cache/:useCache', function (req, res) {
        service.setUseCache(req.params.name, req.params.useCache === 'true').catch(error);
        res.send('🤔');
    });
    router.post('/:name/promote/:environment', function (req, res) {
        service.promote(req.params.name, req.params.environment).catch(error);
        res.send('🤔');
    });
    router.post('/:name/link/:dependency', function (req, res) {
        service.link(req.params.name, req.params.dependency).catch(error);
        res.send('🤔');
    });
    router.post('/:name/unlink/:dependency', function (req, res) {
        service.unlink(req.params.name, req.params.dependency).catch(error);
        res.send('🤔');
    });
    router.post('/:name/edit', function (req, res) {
        service.openInEditor(req.params.name).catch(error);
        res.send('🤔');
    });
    router.post('/:name/bump/:type', function (req, res) {
        service
            .bump(req.params.name, req.params.type)
            .then(function (url) { return res.json({ url: url }); })
            .catch(error);
    });
    router.post('/create/:type', function (req, res) {
        var type = createTypeMap[req.params.type];
        service
            .create(req.body.name, type, req.body.description)
            .then(function () { return res.send('👍'); })
            .catch(error);
    });
    return router;
};
exports.default = createApiComponentRouter;
//# sourceMappingURL=ApiComponentRouter.js.map