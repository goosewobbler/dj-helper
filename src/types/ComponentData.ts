import ComponentType from '../server/service/types/ComponentType';
import ComponentState from './ComponentState';
import ComponentDependency from './ComponentDependency';

export default interface ComponentData {
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
