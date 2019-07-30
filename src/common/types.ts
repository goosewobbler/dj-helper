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

export { Component, ComponentData, ComponentDependency, ComponentState, ComponentType, GraphData, ModuleType };
