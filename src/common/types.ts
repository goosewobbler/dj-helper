import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';
import { IncomingHttpHeaders } from 'http';

enum ModuleType {
  View,
  ViewCSS,
  Data,
}

enum ComponentType {
  Page = 1,
  View,
  Data,
}

enum ComponentState {
  Stopped = 1,
  Starting,
  Installing,
  Building,
  Running,
  Linking,
}

type StateValue = string[] | string | boolean;

interface AppState {
  components: ComponentData[];
  ui: {
    componentToClone?: string;
    editors: string[];
    selectedComponent?: string;
    filter?: string;
    updating?: boolean;
    updated?: boolean;
    showDialog?: string;
    hideDialog?: boolean;
  };
}

interface Component {
  bump(type: BumpType): Promise<void>;
  fetchDetails(): Promise<void>;
  getName(): string;
  getDirectoryName(): string;
  getDisplayName(): string;
  getType(): ComponentType;
  getURL(): string | null;
  getFavourite(): boolean;
  getHistory(): StateValue;
  getUseCache(): boolean;
  setFavourite(favourite: boolean): Promise<void>;
  setUseCache(useCache: boolean): Promise<void>;
  getDependencies(): ComponentDependency[];
  getDependenciesSummary(): Promise<{ name: string }[]>;
  getLatestVersion(): Promise<string>;
  getLinking(): string[];
  getVersions(): Versions;
  getState(): ComponentState;
  getPromoting(): string | null;
  getPromotionFailure(): string | null;
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
  request(props: LooseObject, history: boolean): Promise<Response>;
}

interface ComponentsData {
  components: ComponentData[];
  editors: string[];
}

enum BumpType {
  patch = 'patch',
  minor = 'minor',
}

type ComponentMatch = string | { matched: string };

interface ComponentData {
  name: string;
  displayName: string;
  highlighted?: React.ReactElement[];
  state: ComponentState;
  favourite: boolean;
  history?: StateValue;
  url?: string;
  type?: ComponentType;
  dependencies?: ComponentDependency[];
  linking?: string[];
  promoting?: string;
  promotionFailure?: string;
  useCache: boolean;
  versions?: Versions;
  rendererType: string;
  alternatives?: string[];
  matches?: ComponentMatch[];
}

interface ComponentDependency {
  name: string;
  displayName: string;
  has: string | null;
  latest: string | null;
  linked: boolean;
  outdated: boolean;
  version: string | null;
  rendererType: string | null;
}

interface GraphData {
  edges: {
    from: number;
    to: number;
  }[];
  nodes: {
    id: number;
    name: string;
  }[];
}

interface Response {
  body: string;
  headers: IncomingHttpHeaders;
  statusCode: number;
}

interface Package {
  scripts: { [Key: string]: string };
  dependencies: { [Key: string]: string };
  devDependencies: { [Key: string]: string };
  version: string;
}

interface LooseObject {
  [Key: string]: {} | [] | string | number | boolean;
}

interface AppStatus {
  currentVersion: string;
  updateAvailable: string;
  updated: boolean;
  updating: boolean;
}

interface FileSystem {
  exists(path: string): Promise<boolean>;
  getPackageDirectories(directory: string): string[];
  readFile(path: string): Promise<string>;
  writeFile(path: string, contents: string): Promise<void>;
  symbolicLinkExists(path: string): Promise<boolean>;
  copyDirectory(from: string, to: string, filter: boolean): Promise<void>;
  deleteDirectory(directory: string): void;
  watchDirectory(directory: string, callback: (path: string) => void): Promise<void>;
  moveDirectory(from: string, to: string): void;
  createSymlink(from: string, to: string): void;
  removeSymlink(path: string): void;
}

interface GitSystem {
  checkoutMaster(directory: string): Promise<void>;
  checkoutExistingBranch(directory: string, branchName: string): Promise<void>;
  checkoutNewBranch(directory: string, branchName: string): Promise<void>;
  commit(directory: string, message: string): Promise<void>;
  getCurrentBranch(directory: string): Promise<string>;
  getRandomBranchName(): Promise<string>;
  push(directory: string, branchName: string): Promise<void>;
  readyToCommit(directory: string): Promise<boolean>;
  stageFile(directory: string, path: string): Promise<void>;
}

interface MorphSystem {
  getShrinkwrap(name: string): Promise<{ [Key: string]: string }>;
  getVersionOnEnvironment(name: string, environment: string): Promise<string>;
  promote(name: string, environment: string): Promise<void>;
}

interface NetworkSystem {
  get(url: string): Promise<Response>;
}

interface ProcessSystem {
  getCurrentWorkingDirectory(): Promise<string>;
  log(message: string): void;
  open(url: string): void;
  runToCompletion(
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ): Promise<void>;
  runUntilStopped(
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ): Promise<() => Promise<void>>;
}

interface System {
  file: FileSystem;
  git: GitSystem;
  morph: MorphSystem;
  network: NetworkSystem;
  process: ProcessSystem;
}

type Dispatch = ThunkDispatch<AppState, undefined, AnyAction>;

type storedValue = string[] | string | number | boolean;

interface ValueStore {
  [Key: string]: storedValue;
}

interface Store {
  get(key: string): storedValue | null;
  set(key: string, value: storedValue | null): Promise<void>;
}

// type EnvironmentValues = 'int' | 'local' | 'live' | 'test';
// enum EnvironmentValues {
//   int = 'int',
//   local = 'local',
//   live = 'live',
//   test = 'test',
// }

type Versions = {
  [key: string]: string | null;
};
// type Versions = { [key in EnvironmentValues]: string | null };

interface Service {
  bump(name: string, type: BumpType): Promise<void>;
  build(name: string): Promise<void>;
  clone(name: string, cloneName: string, options: { description: string }): Promise<void>;
  create(name: string, type: ModuleType, options: { description: string }): Promise<void>;
  fetchDetails(name: string): Promise<void>;
  getComponentsData(): ComponentsData;
  getComponentsSummaryData(): ComponentsData;
  getDependantGraph(name: string): GraphData;
  getDependencyGraph(name: string): GraphData;
  link(name: string, dependency: string): Promise<void>;
  openInEditor(name: string): Promise<void>;
  promote(name: string, environment: string): Promise<void>;
  reinstall(name: string): Promise<void>;
  request(name: string, props: LooseObject, history: boolean): Promise<Response>;
  setFavourite(name: string, favourite: boolean): Promise<void>;
  setUseCache(name: string, useCache: boolean): Promise<void>;
  start(name: string): Promise<void>;
  stop(name: string): Promise<void>;
  unlink(name: string, dependency: string): Promise<void>;
}

export {
  Versions,
  LooseObject,
  BumpType,
  Component,
  ComponentData,
  ComponentDependency,
  ComponentMatch,
  ComponentState,
  ComponentType,
  ComponentsData,
  GraphData,
  ModuleType,
  Response,
  Package,
  Service,
  StateValue,
  AppStatus,
  AppState,
  Dispatch,
  System,
  FileSystem,
  GitSystem,
  MorphSystem,
  NetworkSystem,
  ProcessSystem,
  Store,
  storedValue,
  ValueStore,
};
