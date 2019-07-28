import ComponentData from '../../types/IComponentData';
import CreateType from './CreateType';

interface IService {
  bump(name: string, type: 'patch' | 'minor'): Promise<void>;
  build(name: string): Promise<void>;
  create(name: string, type: CreateType, options: { description: string }): Promise<void>;
  fetchDetails(name: string): Promise<void>;
  getComponentsData(): { components: ComponentData[]; editors: string[] };
  getComponentsSummaryData(): { components: ComponentData[]; editors: string[] };
  link(name: string, dependency: string): Promise<void>;
  openInEditor(name: string): Promise<void>;
  promote(name: string, environment: string): Promise<void>;
  reinstall(name: string): Promise<void>;
  request(
    name: string,
    props: { [Key: string]: string },
    history: boolean,
  ): Promise<{ statusCode: number; body: string; headers: { [Key: string]: string } }>;
  setFavorite(name: string, favorite: boolean): Promise<void>;
  setUseCache(name: string, useCache: boolean): Promise<void>;
  start(name: string): Promise<void>;
  stop(name: string): Promise<void>;
  unlink(name: string, dependency: string): Promise<void>;
}

export default IService;
