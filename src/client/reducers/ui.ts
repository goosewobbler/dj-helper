import ComponentData from '../../types/IComponentData';

interface Action {
  type: string;
  component?: ComponentData;
  filter?: string;
  editors?: string[];
  name?: string;
  environment?: string;
  show?: boolean;
}

// interface IComponentState {
//   selectedComponent?: IComponentData;
// }

const reducer = (state: any = {}, action: Action) => {
  switch (action.type) {
    case 'RECEIVE_EDITORS': {
      return {
        ...state,
        editors: action.editors,
      };
    }
    case 'SELECT_COMPONENT': {
      return {
        ...state,
        selectedComponent: action.name,
      };
    }
    case 'FILTER_COMPONENTS': {
      return {
        ...state,
        filter: action.filter,
      };
    }
    case 'UPDATE_AVAILABLE': {
      return {
        ...state,
        outOfDate: true,
      };
    }
    case 'UPDATING': {
      return {
        ...state,
        updated: false,
        updating: true,
      };
    }
    case 'UPDATED': {
      return {
        ...state,
        updated: true,
        updating: false,
      };
    }
    case 'SHOW_CREATE_DIALOG': {
      return {
        ...state,
        showCreateDialog: action.show,
      };
    }
    default:
      return state;
  }
};

export default reducer;
