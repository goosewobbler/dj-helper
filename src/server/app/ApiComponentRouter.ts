import { Router } from 'express';
import CreateType from '../types/CreateType';
import Service from '../types/Service';

const createTypeMap: { [Key: string]: CreateType } = {
  data: CreateType.Data,
  view: CreateType.View,
  viewcss: CreateType.ViewCSS,
};

const error = (ex: any) => {
  console.error(ex.stack);
};

const createApiComponentRouter = (service: Service) => {
  const router = Router();

  router.get('/', (req: any, res: any) => res.json(service.getComponentsSummaryData()));

  router.get('/:name/dependency-graph', (req: any, res: any) => res.json(service.getDependencyGraph(req.params.name)));

  router.get('/:name/dependant-graph', (req: any, res: any) => res.json(service.getDependantGraph(req.params.name)));

  router.post('/:name/versions', (req: any, res: any) => {
    service.fetchDetails(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/start', (req: any, res: any) => {
    service.start(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/stop', (req: any, res: any) => {
    service.stop(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/install', (req: any, res: any) => {
    service.reinstall(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/build', (req: any, res: any) => {
    service.build(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/favorite/:favorite', (req: any, res: any) => {
    service.setFavorite(req.params.name, req.params.favorite === 'true').catch(error);
    res.send('🤔');
  });

  router.post('/:name/cache/:useCache', (req: any, res: any) => {
    service.setUseCache(req.params.name, req.params.useCache === 'true').catch(error);
    res.send('🤔');
  });

  router.post('/:name/promote/:environment', (req: any, res: any) => {
    service.promote(req.params.name, req.params.environment).catch(error);
    res.send('🤔');
  });

  router.post('/:name/link/:dependency', (req: any, res: any) => {
    service.link(req.params.name, req.params.dependency).catch(error);
    res.send('🤔');
  });

  router.post('/:name/unlink/:dependency', (req: any, res: any) => {
    service.unlink(req.params.name, req.params.dependency).catch(error);
    res.send('🤔');
  });

  router.post('/:name/edit', (req: any, res: any) => {
    service.openInEditor(req.params.name).catch(error);
    res.send('🤔');
  });

  router.post('/:name/bump/:type', (req: any, res: any) => {
    service
      .bump(req.params.name, req.params.type)
      .then(url => res.json({ url }))
      .catch(error);
  });

  router.post('/:name/clone', (req: any, res: any) => {
    service
      .clone(req.params.name, req.body.name, { description: req.body.description })
      .then(() => res.send('👍'))
      .catch(error);
  });

  router.post('/create/:type', (req: any, res: any) => {
    const type = createTypeMap[req.params.type];
    service
      .create(req.body.name, type, { description: req.body.description })
      .then(() => res.send('👍'))
      .catch(error);
  });

  return router;
};

export default createApiComponentRouter;
