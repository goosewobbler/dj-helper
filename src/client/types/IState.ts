import IComponentData from '../../types/IComponentData';

interface IState {
  components: IComponentData[];
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
