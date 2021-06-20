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
        editors: action.editors!, // TODO: Tech debt
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
    case 'SHOW_DIALOG': {
      return {
        ...state,
        showDialog: action.name,
        hideDialog: false,
        componentToClone: action.componentToClone,
      };
    }
    case 'HIDE_DIALOG': {
      return {
        ...state,
        hideDialog: true,
      };
    }
    default:
      return state;
  }
};

export default reducer;
