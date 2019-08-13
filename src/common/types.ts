import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

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

interface AppState {
  components: ComponentData[];
  ui: {
    componentToClone?: string;
    editors: string[];
    selectedComponent?: string;
    filter?: string;
    outOfDate?: boolean;
    updating?: boolean;
    updated?: boolean;
    showDialog?: string;
    hideDialog?: string;
  };
}

interface Component {
  bump(type: 'patch' | 'minor'): Promise<void>;
  fetchDetails(): Promise<void>;
  getName(): string;
  getDirectoryName(): string;
  getDisplayName(): string;
  getType(): ComponentType;
  getURL(): string;
  getFavourite(): boolean;
  getHistory(): string[];
  getUseCache(): boolean;
  setFavourite(favourite: boolean): Promise<void>;
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

interface ComponentsData {
  components: ComponentData[];
  editors: string[];
}

interface Service {
  bump(name: string, type: 'patch' | 'minor'): Promise<void>;
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
  request(
    name: string,
    props: LooseObject,
    history: boolean,
  ): Promise<{ statusCode: number; body: string; headers: LooseObject }>;
  setFavourite(name: string, favourite: boolean): Promise<void>;
  setUseCache(name: string, useCache: boolean): Promise<void>;
  start(name: string): Promise<void>;
  stop(name: string): Promise<void>;
  unlink(name: string, dependency: string): Promise<void>;
}

interface ComponentData {
  name: string;
  displayName: string;
  highlighted?: boolean;
  state: ComponentState;
  favourite: boolean;
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
  headers: { [Key: string]: string };
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

type Dispatch = ThunkDispatch<AppState, undefined, AnyAction>;

export {
  LooseObject,
  Component,
  ComponentData,
  ComponentDependency,
  ComponentState,
  ComponentType,
  ComponentsData,
  GraphData,
  ModuleType,
  Response,
  Package,
  Service,
  AppStatus,
  AppState,
  Dispatch,
};
