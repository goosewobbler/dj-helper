import { join } from 'path';
import satisfies from 'semver/functions/satisfies';
import inc from 'semver/functions/inc';

import componentStateMachine from './componentStateMachine';
import { createComponentActions } from './componentActions';
import openInEditorHelper from '../helpers/editor';
import requestHelper from '../helpers/request';
import { logError } from '../helpers/console';
import {
  Component,
  ComponentType,
  ComponentDependency,
  Response,
  Package,
  System,
  Store,
  Versions,
  BumpType,
} from '../../common/types';

const createComponent = (
  system: System,
  routing: Store,
  config: Store,
  state: Store,
  name: string,
  directoryName: string,
  componentPath: string,
  componentType: ComponentType,
  acquirePort: () => number,
  onUpdate: (name: string) => void,
  onReload: (restartOthers: boolean) => Promise<void>,
  getOther: (name: string) => Component,
  rendererType: string,
): Component => {
  let componentPort: number | null = null;
  let pagePort: number | null = null;
  let promoting: string | null = null;
  let promotionFailure: string | null = null;
  let dependencies: ComponentDependency[] = [];
  let url: string | null = null;
  const linking: string[] = [];
  const versions: Versions = {
    int: null,
    live: null,
    local: null,
    test: null,
  };

  const updated = (): void => onUpdate(name);

  const getDisplayName = (): string => directoryName;

  const log = (message: string): void => system.process.log(`[${getDisplayName()}] ${message}`);

  const getPackagePath = (): string => join(componentPath, 'package.json');

  const readPackage = async (): Promise<Package> => JSON.parse(await system.file.readFile(getPackagePath())) as Package;

  const getName = (): string => name;

  const getRendererType = (): string => rendererType;

  const getDirectoryName = (): string => directoryName;

  const getPort = (): number => {
    if (componentPort === null) {
      componentPort = acquirePort();
    }
    return componentPort;
  };

  const setPagePort = (newPagePort: number): void => {
    pagePort = newPagePort;
  };

  const getType = (): ComponentType => componentType;

  const setUrl = (domain: string, port: number, path = ''): void => {
    if (port) {
      url = `http://${domain}:${port}/${path}`;
    }
  };

  const updateURL = (): void => {
    const domain = (config.get('localhost') as string) || 'localhost';
    const type = getType();
    if (type === ComponentType.Page) {
      setUrl(domain, pagePort!); // TODO: Tech debt
    } else if (type === ComponentType.View) {
      setUrl(domain, config.get('componentPort') as number, `view/${name}`);
    } else {
      setUrl(domain, config.get('componentPort') as number, `data/${name}`);
    }
  };

  const getURL = (): string | null => url;

  const getDependency = (dependencyName: string): ComponentDependency | { has: null; latest: null; version: null } => {
    const dependency = dependencies.find((d): boolean => d.name === dependencyName);
    return (
      dependency || {
        has: null,
        latest: null,
        version: null,
      }
    );
  };

  const getDependenciesSummary = async (): Promise<{ name: string }[]> => {
    const packageContents = await readPackage();

    return Object.keys(packageContents.dependencies || {})
      .filter((str): boolean => str.startsWith('bbc-morph-'))
      .map((dependencyName: string): { name: string } => ({ name: dependencyName }));
  };

  const updateDependencies = async (): Promise<void> => {
    const packageContents = await readPackage();
    dependencies = await Promise.all(
      Object.keys(packageContents.dependencies || {})
        .filter((str): boolean => str.startsWith('bbc-morph-'))
        .map(
          async (dependencyName): Promise<ComponentDependency> => {
            return {
              ...getDependency(dependencyName),
              displayName: dependencyName.substr(10),
              linked: await system.file.symbolicLinkExists(join(componentPath, 'node_modules', dependencyName)),
              name: dependencyName,
              rendererType: getRendererType(),
              outdated: false,
            };
          },
        ),
    );

    updated();

    const shrinkwrapped = await system.morph.getShrinkwrap(name);

    const decorateDependency = async (dependency: ComponentDependency): Promise<ComponentDependency> => {
      const other = getOther(dependency.name);
      const version = packageContents.dependencies[dependency.name];
      let latest = null;
      let outdated = false;

      if (other) {
        latest = await other.getLatestVersion();
        outdated = !satisfies(latest, version);
      }

      const has = shrinkwrapped[dependency.name] || '';

      updated();
      return { ...dependency, version, latest, outdated, has };
    };

    dependencies = (await Promise.all(dependencies.map(decorateDependency)).catch(logError)) as ComponentDependency[];

    await Promise.all(dependencies.map(decorateDependency)).catch(logError);
  };

  const getDependencies = (): ComponentDependency[] => dependencies;

  const getLinking = (): string[] => [...linking];

  const updateLocalVersion = async (): Promise<void> => {
    const packageContents = await readPackage();
    versions.local = packageContents.version;
  };

  const fetchEnvironmentVersionAndUpdate = async (environment: 'int' | 'live' | 'test'): Promise<void> => {
    versions[environment] = await system.morph.getVersionOnEnvironment(name, environment);
    updated();
  };

  const updateEnvironmentVersions = async (): Promise<void> => {
    await Promise.all([
      fetchEnvironmentVersionAndUpdate('int'),
      fetchEnvironmentVersionAndUpdate('test'),
      fetchEnvironmentVersionAndUpdate('live'),
    ]);
  };

  const fetchDetails = async (): Promise<void> => {
    await Promise.all([
      (async (): Promise<void> => {
        updateURL();
        await updateLocalVersion();
        updated();
        await updateEnvironmentVersions();
      })(),
      updateDependencies(),
    ]);
  };

  const getVersions = (): Versions => ({ ...versions });

  const getUseCache = (): boolean => Boolean(state.get(`cache.enabled.${name}`));

  const getFavourite = (): boolean => Boolean(state.get(`favourite.${name}`));

  const getHistory = () => (state.get(`history.${name}`) as string[]) || [];

  const actions = createComponentActions(
    system,
    routing,
    config,
    componentPath,
    name,
    getPort,
    log,
    getOther,
    getUseCache,
    onReload,
  );

  const stateMachine = componentStateMachine(actions, (): void => updated());

  const getState = (): number => stateMachine.getState();

  const setUseCache = async (useCache: boolean): Promise<void> => {
    await state.set(`cache.enabled.${name}`, useCache);
    updated();
    await stateMachine.restart();
  };

  const setFavourite = async (favourite: boolean): Promise<void> => {
    await state.set(`favourite.${name}`, favourite);
  };

  const request = async (props: { [Key: string]: string }, history: boolean): Promise<Response> => {
    const response = await requestHelper(
      system,
      config,
      state,
      name,
      componentPath,
      getState(),
      getType(),
      getPort(),
      props,
      log,
      history,
    );
    if (history) {
      updated();
    }
    return response;
  };

  const getPromoting = (): string | null => promoting;

  const getPromotionFailure = (): string | null => promotionFailure;

  const promote = async (environment: string): Promise<void> => {
    if (environment === 'test' || environment === 'live') {
      promoting = environment;
      promotionFailure = null;
      updated();
      try {
        await system.morph.promote(name, environment);
        await updateEnvironmentVersions();
      } catch (failure) {
        promotionFailure = failure as string;
      }
      promoting = null;
      updated();
    } else {
      throw new Error('Invalid environment');
    }
  };

  const openInEditor = (): Promise<void> => openInEditorHelper(system, config, componentPath);

  const reinstall = async (): Promise<void> => {
    await stateMachine.reinstall();
    await updateDependencies();
  };

  const link = async (dependency: string): Promise<void> => {
    linking.push(dependency);
    await stateMachine.link(dependency);
    linking.splice(linking.indexOf(dependency), 1);
    await updateDependencies();
  };

  const unlink = async (dependency: string): Promise<void> => {
    linking.push(dependency);
    await stateMachine.unlink(dependency);
    linking.splice(linking.indexOf(dependency), 1);
    await updateDependencies();
  };

  const makeLinkable = (): Promise<void> => stateMachine.makeLinkable();

  const start = async (): Promise<void> => {
    updateURL();
    await stateMachine.run();
  };

  const stop = (): Promise<void> => stateMachine.stop();

  const build = async (isSassOnly?: boolean, changedPath?: string): Promise<void> => {
    if (changedPath) {
      log(`Rebuilding due to change in ${changedPath}`);
    }

    if (isSassOnly) {
      await stateMachine.buildSass();
    } else {
      await stateMachine.buildAll();
    }
  };

  const getLatestVersion = async (): Promise<string> => {
    versions.int = await system.morph.getVersionOnEnvironment(name, 'int');
    return versions.int;
  };

  const bump = async (type: BumpType): Promise<void> => {
    promoting = 'int';
    promotionFailure = null;
    updated();

    const canBump = await system.git.readyToCommit(componentPath);
    if (!canBump) {
      promoting = null;
      promotionFailure = 'Cannot bump when files are already staged for commit.';
      log(promotionFailure);
      updated();
      return;
    }

    const packageContents = await readPackage();
    const newVersion = inc(packageContents.version, type) as string;
    packageContents.version = newVersion;
    const newBranch = `bump-${name}-${await system.git.getRandomBranchName()}`;
    const currentBranch = await system.git.getCurrentBranch(componentPath);

    await system.git.checkoutMaster(componentPath);
    await system.file.writeFile(getPackagePath(), `${JSON.stringify(packageContents, null, 2)}\n`);
    await system.git.checkoutNewBranch(componentPath, newBranch);
    await system.git.stageFile(componentPath, 'package.json');
    await system.git.commit(componentPath, `bump ${name} to ${newVersion}`);
    await system.git.push(componentPath, newBranch);
    await system.git.checkoutExistingBranch(componentPath, currentBranch);

    log(`Bumped to version ${newVersion} on branch ${newBranch}.`);

    system.process.open(`https://github.com/bbc/morph-modules/compare/${newBranch}?expand=1`);

    promoting = null;
    await updateLocalVersion();
    updated();
  };

  return {
    build,
    bump,
    fetchDetails,
    getDependencies,
    getDependenciesSummary,
    getDirectoryName,
    getDisplayName,
    getFavourite,
    getHistory,
    getLatestVersion,
    getLinking,
    getName,
    getPromoting,
    getPromotionFailure,
    getRendererType,
    getState,
    getType,
    getURL,
    getUseCache,
    getVersions,
    link,
    makeLinkable,
    openInEditor,
    promote,
    reinstall,
    request,
    setFavourite,
    setPagePort,
    setUseCache,
    start,
    stop,
    unlink,
  };
};

export default createComponent;
