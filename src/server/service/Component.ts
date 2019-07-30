import { startsWith } from 'lodash/fp';
import { join } from 'path';
import * as semver from 'semver';

import { System } from '../system';
import { Routing } from './routing';
import { Config } from '../app/config';
import { State } from '../app/state';
import { componentStateMachine, ComponentState } from './componentStateMachine';
import { createComponentActions } from './componentActions';
import openInEditorHelper from '../helpers/editor';
import requestWithRetries from '../helpers/request';

enum ComponentType {
  Page = 1,
  View,
  Data,
}

interface Component {
  bump(type: 'patch' | 'minor'): Promise<void>;
  fetchDetails(): Promise<void>;
  getName(): string;
  getDirectoryName(): string;
  getDisplayName(): string;
  getType(): ComponentType;
  getURL(): string;
  getFavorite(): boolean;
  getHistory(): string[];
  getUseCache(): boolean;
  setFavorite(favorite: boolean): Promise<void>;
  setUseCache(useCache: boolean): Promise<void>;
  getDependencies(): ComponentDependency[];
  getDependenciesSummary(): Promise<{ name: string }[]>;
  getLatestVersion(): Promise<string>;
  getLinking(): string[];
  getVersions(): {
    local: string;
    int: string;
    test: string;
    live: string;
  };
  getState(): ComponentState;
  getPromoting(): string;
  getPromotionFailure(): string;
  getRendererType(): string;
  promote(environment: string): Promise<void>;
  openInEditor(): Promise<void>;
  reinstall(): Promise<void>;
  link(dependency: string): Promise<void>;
  unlink(dependency: string): Promise<void>;
  makeLinkable(): Promise<void>;
  build(isSassOnly?: boolean, path?: string): Promise<void>;
  setPagePort(pagePort: number): void;
  start(): Promise<void>;
  stop(): Promise<void>;
  request(
    props: {
      [Key: string]: string;
    },
    history: boolean,
  ): Promise<{ statusCode: number; body: string; headers: { [Key: string]: string } }>;
}

interface ComponentData {
  name: string;
  displayName: string;
  highlighted?: any;
  state: ComponentState;
  favorite: boolean;
  history?: string[];
  url?: string;
  type?: ComponentType;
  dependencies?: ComponentDependency[];
  linking?: string[];
  promoting?: string;
  promotionFailure?: string;
  useCache: boolean;
  versions?: {
    int: string;
    live: string;
    local: string;
    test: string;
  };
  rendererType: string;
}

interface ComponentDependency {
  name: string;
  displayName: string;
  has: string;
  latest: string;
  linked: boolean;
  outdated: boolean;
  version: string;
  rendererType: string;
}

const createComponent = (
  system: System,
  routing: Routing,
  config: Config,
  state: State,
  name: string,
  directoryName: string,
  componentPath: string,
  componentType: ComponentType,
  acquirePort: () => number,
  onUpdate: (name: string) => Promise<void>,
  onReload: (restartOthers: boolean) => void,
  getOther: (name: string) => Component,
  rendererType: string,
): Component => {
  let port: number = null;
  let pagePort: number = null;
  let promoting: string = null;
  let promotionFailure: string = null;
  let dependencies: ComponentDependency[] = [];
  let url: string = null;
  const linking: string[] = [];
  const versions: { int: string; live: string; local: string; test: string } = {
    int: null,
    live: null,
    local: null,
    test: null,
  };

  const updated = () => onUpdate(name);

  const getDisplayName = () => directoryName;

  const log = (message: string) => system.process.log(`[${getDisplayName()}] ${message}`);

  const getPackagePath = () => join(componentPath, 'package.json');

  const readPackage = async () => JSON.parse(await system.file.readFile(getPackagePath()));

  const getName = () => name;

  const getRendererType = () => rendererType;

  const getDirectoryName = () => directoryName;

  const getPort = () => {
    if (port === null) {
      port = acquirePort();
    }
    return port;
  };

  const setPagePort = (newPagePort: number) => {
    pagePort = newPagePort;
  };

  const getType = () => componentType;

  const updateURL = async () => {
    const localhost = config.getValue('localhost') || 'localhost';
    const type = getType();
    if (type === ComponentType.Page) {
      if (pagePort) {
        url = `http://${localhost}:${pagePort}`;
      }
    } else if (type === ComponentType.View) {
      url = `http://${localhost}:4000/view/${name}`;
    } else {
      url = `http://${localhost}:4000/data/${name}`;
    }
  };

  const getURL = () => url;

  const getDependency = (dependencyName: string): any => {
    const dependency = dependencies.find(d => d.name === dependencyName);
    return (
      dependency || {
        has: null,
        latest: null,
        version: null,
      }
    );
  };

  const getDependenciesSummary = async () => {
    const packageContents = await readPackage();

    return Object.keys(packageContents.dependencies || {})
      .filter(startsWith('bbc-morph-'))
      .map((dependencyName: string) => ({ name: dependencyName }));
  };

  const updateDependencies = async () => {
    const packageContents = await readPackage();
    dependencies = await Promise.all(
      Object.keys(packageContents.dependencies || {})
        .filter(startsWith('bbc-morph-'))
        .map(
          async (dependencyName): Promise<ComponentDependency> => {
            return {
              ...getDependency(dependencyName),
              displayName: dependencyName.substr(10),
              linked: await system.file.symbolicLinkExists(join(componentPath, 'node_modules', dependencyName)),
              name: dependencyName,
            };
          },
        ),
    );

    await updated();

    const updateLazy = Promise.all(
      dependencies.map(async dependency => {
        const other = getOther(dependency.name);
        const version = packageContents.dependencies[dependency.name];
        let latest = null;
        let outdated = false;

        if (other) {
          latest = await other.getLatestVersion();
          outdated = !semver.satisfies(latest, version);
        }

        dependency.version = version;
        dependency.latest = latest;
        dependency.outdated = outdated;
        await updated();
      }),
    ).catch(console.error);

    const shrinkwrapped = await system.morph.getShrinkwrapped(name);
    dependencies.forEach(dependency => {
      dependency.has = shrinkwrapped[dependency.name] || '';
    });

    await updated();

    await updateLazy;
  };

  const getDependencies = () => dependencies;

  const getLinking = () => [...linking];

  const updateLocalVersion = async () => {
    const packageContents = await readPackage();
    versions.local = packageContents.version;
  };

  const fetchEnvironmentVersionAndUpdate = async (environment: 'int' | 'live' | 'test') => {
    versions[environment] = await system.morph.getVersionOnEnvironment(name, environment);
    await updated();
  };

  const updateEnvironmentVersions = async () => {
    await Promise.all([
      fetchEnvironmentVersionAndUpdate('int'),
      fetchEnvironmentVersionAndUpdate('test'),
      fetchEnvironmentVersionAndUpdate('live'),
    ]);
  };

  const fetchDetails = async () => {
    await Promise.all([
      (async () => {
        await updateURL();
        await updateLocalVersion();
        await updated();
        await updateEnvironmentVersions();
      })(),
      updateDependencies(),
    ]);
  };

  const getVersions = () => ({ ...versions });

  const getUseCache = () => Boolean(state.retrieve(`cache.enabled.${name}`));

  const getFavorite = () => Boolean(state.retrieve(`favorite.${name}`));

  const getHistory = () => state.retrieve(`history.${name}`) || [];

  const setUseCache = async (useCache: boolean) => {
    await state.store(`cache.enabled.${name}`, useCache);
    await updated();
    await stateMachine.restart();
  };

  const setFavorite = async (favorite: boolean) => {
    await state.store(`favorite.${name}`, favorite || null);
  };

  const request = async (props: { [Key: string]: string }, history: boolean) => {
    const response = await requestWithRetries(
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
      await updated();
    }
    return response;
  };

  const getPromoting = () => promoting;

  const getPromotionFailure = () => promotionFailure;

  const promote = async (environment: string) => {
    if (environment === 'test' || environment === 'live') {
      promoting = environment;
      promotionFailure = null;
      await updated();
      try {
        await system.morph.promote(name, environment);
        await updateEnvironmentVersions();
      } catch (failure) {
        promotionFailure = failure;
      }
      promoting = null;
      await updated();
    } else {
      throw new Error('Invalid environment');
    }
  };

  const openInEditor = () => openInEditorHelper(system, config, componentPath);

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
  const stateMachine = componentStateMachine(actions, () => updated());

  const getState = () => stateMachine.getState();

  const reinstall = async () => {
    await stateMachine.reinstall();
    await updateDependencies();
  };

  const link = async (dependency: string) => {
    linking.push(dependency);
    await stateMachine.link(dependency);
    linking.splice(linking.indexOf(dependency), 1);
    await updateDependencies();
  };

  const unlink = async (dependency: string) => {
    linking.push(dependency);
    await stateMachine.unlink(dependency);
    linking.splice(linking.indexOf(dependency), 1);
    await updateDependencies();
  };

  const makeLinkable = () => stateMachine.makeLinkable();

  const start = async () => {
    await updateURL();
    await stateMachine.run();
  };

  const stop = () => stateMachine.stop();

  const build = async (isSassOnly?: boolean, changedPath?: string) => {
    if (changedPath) {
      log(`Rebuilding due to change in ${changedPath}`);
    }

    if (isSassOnly) {
      await stateMachine.buildSass();
    } else {
      await stateMachine.buildAll();
    }
  };

  const getLatestVersion = async () => {
    versions.int = await system.morph.getVersionOnEnvironment(name, 'int');
    return versions.int;
  };

  const bump = async (type: 'patch' | 'minor'): Promise<void> => {
    promoting = 'int';
    promotionFailure = null;
    await updated();

    const canBump = await system.git.readyToCommit(componentPath);
    if (!canBump) {
      promoting = null;
      promotionFailure = 'Cannot bump when files are already staged for commit.';
      log(promotionFailure);
      await updated();
      return null;
    }

    const packageContents = await readPackage();
    const newVersion = semver.inc(packageContents.version, type);
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

    await system.process.open(`https://github.com/bbc/morph-modules/compare/${newBranch}?expand=1`);

    promoting = null;
    await updateLocalVersion();
    await updated();
  };

  return {
    build,
    bump,
    fetchDetails,
    getDependencies,
    getDependenciesSummary,
    getDirectoryName,
    getDisplayName,
    getFavorite,
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
    setFavorite,
    setPagePort,
    setUseCache,
    start,
    stop,
    unlink,
  };
};

export { createComponent, Component, ComponentType, ComponentData, ComponentDependency };
