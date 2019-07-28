import ComponentData from '../../types/ComponentData';
import Theme from '../../types/Theme';

export default interface State {
  components: ComponentData[];
  ui: {
    cloningName?: string;
    editors: string[];
    selectedComponent?: string;
    filter?: string;
    outOfDate?: boolean;
    updating?: boolean;
    updated?: boolean;
    showCreateDialog?: boolean;
    theme: Theme;
  };
}
