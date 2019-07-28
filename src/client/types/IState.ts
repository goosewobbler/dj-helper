import ComponentData from '../../types/IComponentData';

interface IState {
  components: ComponentData[];
  ui: {
    editors: string[];
    selectedComponent?: string;
    filter?: string;
    outOfDate?: boolean;
    updating?: boolean;
    updated?: boolean;
    showCreateDialog?: boolean;
  };
}

export default IState;
