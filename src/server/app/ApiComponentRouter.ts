import { Router, Request, Response } from 'express';
import { ModuleType } from '../../common/types';
import { Service } from '../service';
import { logError } from '../helpers/console';

const moduleTypeMap: { [Key: string]: ModuleType } = {
  data: ModuleType.Data,
  view: ModuleType.View,
  viewcss: ModuleType.ViewCSS,
};

const createApiComponentRouter = (service: Service): Router => {
  const router = Router();

  router.get('/', (req: Request, res: Response): Response => res.json(service.getComponentsSummaryData()));

  router.get(
    '/:name/dependency-graph',
    (req: Request, res: Response): Response => res.json(service.getDependencyGraph(req.params.name)),
  );

  router.get(
    '/:name/dependant-graph',
    (req: Request, res: Response): Response => res.json(service.getDependantGraph(req.params.name)),
  );

  router.post('/:name/versions', (req: Request, res: Response): void => {
    service.fetchDetails(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/start', (req: Request, res: Response): void => {
    service.start(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/stop', (req: Request, res: Response): void => {
    service.stop(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/install', (req: Request, res: Response): void => {
    service.reinstall(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/build', (req: Request, res: Response): void => {
    service.build(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/favorite/:favorite', (req: Request, res: Response): void => {
    service.setFavorite(req.params.name, req.params.favorite === 'true').catch(logError);
    res.send('🤔');
  });

  router.post('/:name/cache/:useCache', (req: Request, res: Response): void => {
    service.setUseCache(req.params.name, req.params.useCache === 'true').catch(logError);
    res.send('🤔');
  });

  router.post('/:name/promote/:environment', (req: Request, res: Response): void => {
    service.promote(req.params.name, req.params.environment).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/link/:dependency', (req: Request, res: Response): void => {
    service.link(req.params.name, req.params.dependency).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/unlink/:dependency', (req: Request, res: Response): void => {
    service.unlink(req.params.name, req.params.dependency).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/edit', (req: Request, res: Response): void => {
    service.openInEditor(req.params.name).catch(logError);
    res.send('🤔');
  });

  router.post('/:name/bump/:type', (req: Request, res: Response): void => {
    service
      .bump(req.params.name, req.params.type)
      .then((url): Response => res.json({ url }))
      .catch(logError);
  });

  router.post('/:name/clone', (req: Request, res: Response): void => {
    service
      .clone(req.params.name, req.body.name, { description: req.body.description })
      .then((): Response => res.send('👍'))
      .catch(logError);
  });

  router.post('/create/:type', (req: Request, res: Response): void => {
    const type = moduleTypeMap[req.params.type];
    service
      .create(req.body.name, type, { description: req.body.description })
      .then((): Response => res.send('👍'))
      .catch(logError);
  });

  return router;
};

export default createApiComponentRouter;
