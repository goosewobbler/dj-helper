import { get } from 'lodash';
import { join } from 'path';

import ComponentState from '../../types/ComponentState';
import IComponentData from '../../types/ComponentData';
import Theme from '../app/Theme';
import CreateType from '../types/CreateType';
import IConfig from '../types/IConfig';
import IGrapher from '../types/IGrapher';
import IRouting from '../types/IRouting';
import IService from '../types/IService';
import IState from '../types/IState';
import ISystem from '../types/ISystem';
import Component from './Component';
import Grapher from './Grapher';
import cloneComponent from './helpers/clone';
import getComponentType from './helpers/componentType';
import createComponent from './helpers/create';
import Routing from './Routing';
import ComponentType from './types/ComponentType';
import IComponent from './types/IComponent';

const Service = async (
  system: ISystem,
  config: IConfig,
  state: IState,
  onComponentUpdate: (data: IComponentData) => void,
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
  const theme = await Theme(config);
  const allDependencies: { [Key: string]: Array<{ name: string }> } = {};
  let grapher: IGrapher;

  const acquirePort = () => nextPort++;

  const onComponentUpdated = async (name: string) => {
    const data = await getData(name);
    onComponentUpdate(data);
  };

  const restartRunning = () => {
    const running = components.filter(component => component.getState() === ComponentState.Running);

    return Promise.all(
      running.map(async component => {
        await component.stop();
        await component.start();
      }),
    );
  };

  const addComponent = async (componentDirectoryName: string): Promise<IComponent> => {
    const componentDirectory = join(options.componentsDirectory, componentDirectoryName);
    const packageContents = JSON.parse(await system.file.readFile(join(componentDirectory, 'package.json')));
    const componentType = getComponentType(config, packageContents, packageContents.name);
    const rendererType = get(packageContents, 'morph.rendererType', 'node:0.12').replace('node:', '');

    const reloadHandler = async (restartOthers: boolean) => {
      if (restartOthers) {
        await restartRunning();
      }
      return onReload();
    };

    const component = Component(
      system,
      routing,
      config,
      state,
      packageContents.name,
      componentDirectoryName,
      componentDirectory,
      componentType,
      acquirePort,
      onComponentUpdated,
      reloadHandler,
      getComponent,
      rendererType,
    );
    components.push(component);
    return component;
  };

  const load = async () => {
    routing = await Routing(options.routingFilePath, system);

    const packageDirectories = await system.file.getPackageDirectories(options.componentsDirectory);

    await Promise.all(packageDirectories.map(addComponent));

    for (const component of components) {
      allDependencies[component.getName()] = await component.getDependenciesSummary();
    }
    grapher = Grapher(allDependencies);

    await system.file.watchDirectory(options.componentsDirectory, async path => {
      const relativePath = path.replace(options.componentsDirectory + '/', '');
      const slashIndex = relativePath.indexOf('/');
      const directoryName = relativePath.substr(0, slashIndex);
      const changedComponent = components.find(component => component.getDirectoryName() === directoryName);
      if (changedComponent && changedComponent.getState() === ComponentState.Running) {
        const isSass = relativePath.indexOf('/sass/') > -1;
        await changedComponent.build(isSass, relativePath.replace(directoryName + '/', ''));
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

  const getSummaryData = (name: string): IComponentData => {
    const component = getComponent(name);

    return {
      displayName: component.getDisplayName(),
      favorite: component.getFavorite(),
      name: component.getName(),
      rendererType: component.getRendererType(),
      state: component.getState(),
      useCache: component.getUseCache(),
    };
  };

  const getData = (name: string): IComponentData => {
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
      rendererType: component.getRendererType(),
      state: component.getState(),
      type: component.getType(),
      url: component.getURL(),
      useCache: component.getUseCache(),
      versions: component.getVersions(),
    };
  };

  const clone = async (name: string, cloneName: string, cloneOptions: { description: string }) => {
    const componentDirectoryName = getComponent(name).getDirectoryName();
    const componentDirectory = join(options.componentsDirectory, componentDirectoryName);
    const clonedComponentDirectory = join(options.componentsDirectory, cloneName);
    await cloneComponent(system, componentDirectory, cloneName, clonedComponentDirectory, cloneOptions);
    await addComponent(cloneName);
  };

  const create = async (name: string, type: CreateType, createOptions: { description: string }) => {
    await createComponent(system, name, type, createOptions);
    await addComponent(name);
  };

  const getComponentsData = () => ({
    components: components.map(component => getData(component.getName())),
    editors,
    theme: theme.getValues(),
  });

  const getComponentsSummaryData = () => ({
    components: components.map(component =>
      component.getState() === ComponentState.Running
        ? getData(component.getName())
        : getSummaryData(component.getName()),
    ),
    editors,
    theme: theme.getValues(),
  });

  const getDependantGraph = (name: string) => grapher.getDependantData(name);

  const getDependencyGraph = (name: string) => grapher.getDependencyData(name);

  const getTheme = () => theme.getValues();
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
    if (component.getType() === ComponentType.Page) {
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
    clone,
    create,
    fetchDetails,
    getComponentsData,
    getComponentsSummaryData,
    getDependantGraph,
    getDependencyGraph,
    getTheme,
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
