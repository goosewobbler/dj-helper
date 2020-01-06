import { get } from 'lodash';
import { join } from 'path';

import startPageServer from '../app/pageServer';
import getComponentType from '../helpers/componentType';
import { createComponentFiles, cloneComponentFiles } from '../helpers/files';
import { createGrapher, Grapher } from './grapher';
import createTheme from '../app/theme';
import createComponent from './component';
import {
  ModuleType,
  Component,
  ComponentType,
  ComponentData,
  ComponentState,
  GraphData,
  Response,
  Service,
  System,
  Store,
  BumpType,
  LooseObject,
  ComponentsData,
  Theme,
} from '../../common/types';

const createService = async (
  system: System,
  config: Store,
  state: Store,
  routing: Store,
  onComponentUpdate: (data: ComponentData) => void,
  onReload: () => void,
  componentsDirectory: string,
): Promise<Service> => {
  const components: Component[] = [];
  const nextPort = 8083;
  const theme = createTheme(config);
  const editors: string[] = [];
  const allDependencies: { [Key: string]: { name: string }[] } = {};
  let grapher: Grapher;

  const acquirePort = (): number => nextPort + 1;

  const getComponent = (name: string): Component =>
    components.find((component): boolean => component.getName() === name)!;

  const getData = (name: string): ComponentData => {
    const component = getComponent(name);

    return {
      dependencies: component.getDependencies(),
      displayName: component.getDisplayName(),
      favourite: component.getFavourite(),
      history: component.getHistory(),
      linking: component.getLinking(),
      name: component.getName(),
      promoting: component.getPromoting()!,
      promotionFailure: component.getPromotionFailure()!,
      rendererType: component.getRendererType(),
      state: component.getState(),
      type: component.getType(),
      url: component.getURL()!,
      useCache: component.getUseCache(),
      versions: component.getVersions(),
    };
  };

  const onComponentUpdated = (name: string): void => {
    const data = getData(name);
    onComponentUpdate(data);
  };

  const restartRunning = (): Promise<void[]> => {
    const running = components.filter((component): boolean => component.getState() === ComponentState.Running);

    return Promise.all(
      running.map(
        async (component): Promise<void> => {
          await component.stop();
          await component.start();
        },
      ),
    );
  };

  const addComponent = async (componentDirectoryName: string): Promise<Component> => {
    const componentDirectory = join(componentsDirectory, componentDirectoryName);
    const packageContents = JSON.parse(await system.file.readFile(join(componentDirectory, 'package.json')));
    const componentType = getComponentType(config, packageContents, packageContents.name);
    const rendererType = get(packageContents, 'morph.rendererType', 'node:0.12').replace('node:', '');

    const reloadHandler = async (restartOthers: boolean): Promise<void> => {
      if (restartOthers) {
        await restartRunning();
      }
      return onReload();
    };

    const component = createComponent(
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

  const load = async (): Promise<void> => {
    const packageDirectories = system.file.getPackageDirectories(componentsDirectory);

    await Promise.all(packageDirectories.map(addComponent));
    await Promise.all(
      components.map(
        async (component: Component): Promise<void> => {
          allDependencies[component.getName()] = await component.getDependenciesSummary();
        },
      ),
    );
    grapher = createGrapher(allDependencies);

    await system.file.watchDirectory(componentsDirectory, (path): void => {
      const relativePath = path.replace(`${componentsDirectory}/`, '');
      const slashIndex = relativePath.indexOf('/');
      const directoryName = relativePath.substr(0, slashIndex);
      const changedComponent = components.find((component): boolean => component.getDirectoryName() === directoryName);
      if (changedComponent && changedComponent.getState() === ComponentState.Running) {
        const isSass = relativePath.includes('/sass/');
        changedComponent.build(isSass, relativePath.replace(`${directoryName}/`, ''));
      }
    });

    await system.process.runToCompletion(
      await system.process.getCurrentWorkingDirectory(),
      'which code',
      (): void => {
        editors.push('code');
      },
      (): null => null,
    );
  };

  const getSummaryData = (name: string): ComponentData => {
    const component = getComponent(name);

    return {
      displayName: component.getDisplayName(),
      favourite: component.getFavourite(),
      name: component.getName(),
      rendererType: component.getRendererType(),
      state: component.getState(),
      useCache: component.getUseCache(),
    };
  };

  const clone = async (name: string, cloneName: string, options: { description: string }): Promise<void> => {
    const componentDirectoryName = getComponent(name).getDirectoryName();
    const componentDirectory = join(componentsDirectory, componentDirectoryName);
    const clonedComponentDirectory = join(componentsDirectory, cloneName);
    await cloneComponentFiles(system, componentDirectory, cloneName, clonedComponentDirectory, options);
    await addComponent(cloneName);
  };

  const create = async (name: string, type: ModuleType, options: { description: string }): Promise<void> => {
    await createComponentFiles(system, name, type, options);
    await addComponent(name);
  };

  const getComponentsData = (): ComponentsData => ({
    components: components.map((component): ComponentData => getData(component.getName())),
    editors,
  });

  const getComponentsSummaryData = (): ComponentsData => ({
    components: components.map(
      (component): ComponentData =>
        component.getState() === ComponentState.Running
          ? getData(component.getName())
          : getSummaryData(component.getName()),
    ),
    editors,
  });

  const getDependantGraph = (name: string): GraphData => grapher.getDependantData(name);

  const getDependencyGraph = (name: string): GraphData => grapher.getDependencyData(name);
  const getTheme = (): Theme => theme.getValues();
  const bump = (name: string, type: BumpType): Promise<void> => getComponent(name).bump(type);
  const build = (name: string): Promise<void> => getComponent(name).build();
  const fetchDetails = (name: string): Promise<void> => getComponent(name).fetchDetails();
  const link = (name: string, dependency: string): Promise<void> => getComponent(name).link(dependency);
  const openInEditor = (name: string): Promise<void> => getComponent(name).openInEditor();
  const promote = (name: string, environment: string): Promise<void> => getComponent(name).promote(environment);
  const reinstall = (name: string): Promise<void> => getComponent(name).reinstall();
  const request = (name: string, props: LooseObject, history: boolean): Promise<Response> =>
    getComponent(name).request(props, history);
  const setFavourite = (name: string, useCache: boolean): Promise<void> => getComponent(name).setFavourite(useCache);
  const setUseCache = (name: string, useCache: boolean): Promise<void> => getComponent(name).setUseCache(useCache);
  const stop = (name: string): Promise<void> => getComponent(name).stop();
  const unlink = (name: string, dependency: string): Promise<void> => getComponent(name).unlink(dependency);

  await load();

  const service = {
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
    setFavourite,
    setUseCache,
    stop,
    start: async (name: string): Promise<void> => {
      const component = getComponent(name);
      if (component.getType() === ComponentType.Page) {
        const port = await startPageServer(service, name, config);
        component.setPagePort(port);
      }
      await component.start();
    },
    unlink,
  };

  return service;
};

export default createService;
