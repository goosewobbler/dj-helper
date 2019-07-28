import ComponentState from '../../../types/ComponentState';
import ComponentDependency from '../../../types/ComponentDependency';
import ComponentType from './ComponentType';

interface IComponent {
  bump(type: 'patch' | 'minor'): Promise<void>;
  fetchDetails(): Promise<void>;
  getName(): string;
  getDirectoryName(): string;
  getDisplayName(): string;
  getType(): Promise<ComponentType>;
  getURL(): string;
  getFavorite(): boolean;
  getHistory(): string[];
  getUseCache(): boolean;
  setFavorite(favorite: boolean): Promise<void>;
  setUseCache(useCache: boolean): Promise<void>;
  getDependencies(): ComponentDependency[];
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

export default IComponent;
