import { join } from 'path';
import ComponentState from '../../types/ComponentState';
import ComponentData from '../../types/IComponentData';
import CreateType from '../types/CreateType';
import IConfig from '../types/IConfig';
import IRouting from '../types/IRouting';
import IService from '../types/IService';
import IState from '../types/IState';
import ISystem from '../types/ISystem';
import Component from './Component';
import createComponent from './helpers/create';
import Routing from './Routing';
import ComponentType from './types/ComponentType';
import IComponent from './types/IComponent';

const Service = async (
  system: ISystem,
  config: IConfig,
  state: IState,
  onComponentUpdate: (data: ComponentData) => void,
  onReload: () => void,
  startPageServer: (name: string) => Promise<number>,
  options: {
    componentsDirectory: string;
    routingFilePath: string;
  },
): Promise<IService> => {
  const components: IComponent[] = [];
  let nextPort = 8083;
  let routing: IRouting;
  const editors: string[] = [];

  const acquirePort = () => nextPort++;

  const onComponentUpdated = async (name: string) => {
    const data = await getData(name);
    onComponentUpdate(data);
  };

  const addComponent = async (componentDirectoryName: string): Promise<IComponent> => {
    const componentDirectory = join(options.componentsDirectory, componentDirectoryName);
    const packageContents = JSON.parse(await system.file.readFile(join(componentDirectory, 'package.json')));

    const component = Component(
      system,
      routing,
      config,
      state,
      packageContents.name,
      componentDirectoryName,
      componentDirectory,
      acquirePort,
      onComponentUpdated,
      onReload,
      getComponent,
    );
    components.push(component);
    return component;
  };

  const load = async () => {
    routing = await Routing(options.routingFilePath, system);

    const packageDirectories = await system.file.getPackageDirectories(options.componentsDirectory);

    await Promise.all(packageDirectories.map(addComponent));

    await system.file.watchDirectory(options.componentsDirectory, async path => {
      const relativePath = path.replace(`${options.componentsDirectory}/`, '');
      const slashIndex = relativePath.indexOf('/');
      const directoryName = relativePath.substr(0, slashIndex);
      const changedComponent = components.find(component => component.getDirectoryName() === directoryName);
      if (changedComponent && changedComponent.getState() === ComponentState.Running) {
        const isSass = relativePath.indexOf('/sass/') > -1;
        await changedComponent.build(isSass, relativePath.replace(`${directoryName}/`, ''));
      }
    });

    await system.process.runToCompletion(
      await system.process.getCurrentWorkingDirectory(),
      'which code',
      (message: string) => {
        editors.push('code');
      },
      () => null,
    );
  };

  const getComponent = (name: string) => components.find(component => component.getName() === name);

  const getSummaryData = (name: string): ComponentData => {
    const component = getComponent(name);

    return {
      displayName: component.getDisplayName(),
      favorite: component.getFavorite(),
      name: component.getName(),
      state: component.getState(),
      useCache: component.getUseCache(),
    };
  };

  const getData = (name: string): ComponentData => {
    const component = getComponent(name);

    return {
      dependencies: component.getDependencies(),
      displayName: component.getDisplayName(),
      favorite: component.getFavorite(),
      history: component.getHistory(),
      linking: component.getLinking(),
      name: component.getName(),
      promoting: component.getPromoting(),
      promotionFailure: component.getPromotionFailure(),
      state: component.getState(),
      url: component.getURL(),
      useCache: component.getUseCache(),
      versions: component.getVersions(),
    };
  };

  const create = async (name: string, type: CreateType, createOptions: { description: string }) => {
    await createComponent(system, name, type, createOptions);
    await addComponent(name);
  };

  const getComponentsData = () => ({
    components: components.map(component => getData(component.getName())),
    editors,
  });

  const getComponentsSummaryData = () => ({
    components: components.map(component =>
      component.getState() === ComponentState.Running
        ? getData(component.getName())
        : getSummaryData(component.getName()),
    ),
    editors,
  });

  const bump = (name: string, type: 'patch' | 'minor') => getComponent(name).bump(type);
  const build = (name: string) => getComponent(name).build();
  const fetchDetails = (name: string) => getComponent(name).fetchDetails();
  const link = (name: string, dependency: string) => getComponent(name).link(dependency);
  const openInEditor = (name: string) => getComponent(name).openInEditor();
  const promote = (name: string, environment: string) => getComponent(name).promote(environment);
  const reinstall = (name: string) => getComponent(name).reinstall();
  const request = (name: string, props: { [Key: string]: string }, history: boolean) =>
    getComponent(name).request(props, history);
  const setFavorite = (name: string, useCache: boolean) => getComponent(name).setFavorite(useCache);
  const setUseCache = (name: string, useCache: boolean) => getComponent(name).setUseCache(useCache);
  const start = async (name: string) => {
    const component = getComponent(name);
    if ((await component.getType()) === ComponentType.Page) {
      const port = await startPageServer(name);
      component.setPagePort(port);
    }
    await component.start();
  };
  const stop = (name: string) => getComponent(name).stop();
  const unlink = (name: string, dependency: string) => getComponent(name).unlink(dependency);

  await load();

  return {
    build,
    bump,
    create,
    fetchDetails,
    getComponentsData,
    getComponentsSummaryData,
    link,
    openInEditor,
    promote,
    reinstall,
    request,
    setFavorite,
    setUseCache,
    start,
    stop,
    unlink,
  };
};

export default Service;
