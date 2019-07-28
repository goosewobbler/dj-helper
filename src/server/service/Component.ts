import { startsWith } from 'lodash/fp';
import { join } from 'path';
import * as semver from 'semver';

import ComponentDependency from '../../types/ComponentDependency';
import IConfig from '../types/IConfig';
import IRouting from '../types/IRouting';
import IState from '../types/IState';
import ISystem from '../types/ISystem';
import ComponentActions from './ComponentActions';
import ComponentStateMachine from './ComponentStateMachine';
import getDefaulTypeOverride from './DefaultTypeOverrides';
import openInEditorHelper from './helpers/editor';
import requestWithRetries from './helpers/request';
import ComponentType from './types/ComponentType';
import IComponent from './types/IComponent';

const Component = (
  system: ISystem,
  routing: IRouting,
  config: IConfig,
  state: IState,
  name: string,
  directoryName: string,
  componentPath: string,
  acquirePort: () => number,
  onUpdate: (name: string) => Promise<void>,
  onReload: () => void,
  getOther: (name: string) => IComponent,
): IComponent => {
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

  const getType = async () => {
    const typeOverride = getDefaulTypeOverride(name) || config.getValue(`typeOverrides.${name}`);
    if (typeOverride) {
      switch (typeOverride) {
        case 'data':
          return ComponentType.Data;
        case 'view':
          return ComponentType.View;
        case 'page':
          return ComponentType.Page;
      }
    }

    const packageContents = await readPackage();
    const packageDependencies = packageContents.dependencies || {};
    if (packageDependencies['bbc-morph-page-assembler']) {
      return ComponentType.Page;
    }
    if (packageDependencies.react) {
      return ComponentType.View;
    }
    return ComponentType.Data;
  };

  const updateURL = async () => {
    const localhost = config.getValue('localhost') || 'localhost';
    const type = await getType();
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
      getState(),
      await getType(),
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

  const openInEditor = () => openInEditorHelper(system, componentPath);

  const actions = ComponentActions(
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
  const stateMachine = ComponentStateMachine(actions, () => updated());

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
    await system.file.writeFile(getPackagePath(), `${JSON.stringify(packageContents, null, 2)}\n`);

    const newBranch = `bump-${name}-${await system.git.getRandomBranchName()}`;
    const currentBranch = await system.git.getCurrentBranch(componentPath);

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
    getDirectoryName,
    getDisplayName,
    getFavorite,
    getHistory,
    getLatestVersion,
    getLinking,
    getName,
    getPromoting,
    getPromotionFailure,
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

export default Component;
