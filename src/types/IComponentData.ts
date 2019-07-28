import ComponentState from './ComponentState';
import ComponentDependency from './ComponentDependency';

export default interface ComponentData {
  name: string;
  displayName: string;
  highlighted?: string;
  state: ComponentState;
  favorite: boolean;
  history?: string[];
  url?: string;
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
}
