import { ComponentState } from '../../common/types';

interface Action {
  type: string;
  components?: any[];
  component?: any;
  favourite?: boolean;
  name?: string;
  displayName?: string;
  environment?: string;
  state?: ComponentState;
  dependency?: string;
}

const reducer = (state: any[] = [], action: Action) => {
  switch (action.type) {
    case 'CREATE_COMPONENT': {
      return [...state, { name: action.name, displayName: action.displayName }];
    }
    case 'RECEIVE_COMPONENTS': {
      return action.components;
    }
    case 'RECEIVE_COMPONENT': {
      return state.filter(component => component.name !== action.component.name).concat(action.component);
    }
    case 'CHANGE_COMPONENT_STATE': {
      return state.map(component => {
        if (component.name === action.name) {
          return {
            ...component,
            state: action.state,
          };
        }
        return component;
      });
    }
    case 'LINKING_COMPONENT': {
      return state.map(component => {
        if (component.name === action.name) {
          return {
            ...component,
            linking: [action.dependency],
          };
        }
        return component;
      });
    }
    case 'PROMOTING_COMPONENT': {
      return state.map(component => {
        if (component.name === action.name) {
          return {
            ...component,
            promoting: action.environment,
          };
        }
        return component;
      });
    }
    case 'FAVOURITE_COMPONENT': {
      return state.map(component => {
        if (component.name === action.name) {
          return {
            ...component,
            favourite: action.favourite,
          };
        }
        return component;
      });
    }
    default:
      return state;
  }
};

export default reducer;
