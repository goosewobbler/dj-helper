import ComponentState from './ComponentState';
import IComponentDependency from './IComponentDependency';

interface IComponentData {
  name: string;
  displayName: string;
  highlighted?: string;
  state: ComponentState;
  favorite: boolean;
  history?: string[];
  url?: string;
  dependencies?: IComponentDependency[];
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

export default IComponentData;
