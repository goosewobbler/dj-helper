import { ComponentData, AppState } from '../../common/types';

interface Action {
  type: string;
  component?: ComponentData;
  filter?: string;
  editors?: string[];
  name?: string;
  environment?: string;
  show?: boolean;
  componentToClone?: string;
}

const reducer = (state: AppState['ui'] = { editors: [] }, action: Action): AppState['ui'] => {
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
    case 'SHOW_DIALOG': {
      return {
        ...state,
        showDialog: action.name,
        componentToClone: action.componentToClone,
      };
    }
    case 'HIDE_DIALOG': {
      return {
        ...state,
        showDialog: null,
        componentToClone: null,
      };
    }
    default:
      return state;
  }
};

export default reducer;
