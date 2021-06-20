import { ComponentState, ComponentData } from '../../common/types';

interface Action {
  type: string;
  components?: ComponentData[];
  component?: ComponentData;
  favourite?: boolean;
  name?: string;
  displayName?: string;
  environment?: string;
  state?: ComponentState;
  dependency?: string;
}

const reducer = (state: ComponentData[] = [], action: Action): ComponentData[] => {
  switch (action.type) {
    case 'CREATE_COMPONENT': {
      return [
        ...state,
        {
          name: action.name!, // TODO: Tech debt
          displayName: action.displayName!,
          state: action.state!, // TODO: Tech debt
          favourite: false,
          useCache: false,
          rendererType: 'node:10',
        },
      ];
    }
    case 'RECEIVE_COMPONENTS': {
      return action.components!; // TODO: Tech debt
    }
    case 'RECEIVE_COMPONENT': {
      return state.filter((component): boolean => component.name !== action.component!.name).concat(action.component!); // TODO: Tech debt
    }
    case 'CHANGE_COMPONENT_STATE': {
      return state.map(
        (component): ComponentData => {
          if (component.name === action.name) {
            return {
              ...component,
              state: action.state!, // TODO: Tech debt
            };
          }
          return component;
        },
      );
    }
    case 'LINKING_COMPONENT': {
      return state.map(
        (component): ComponentData => {
          if (component.name === action.name) {
            return {
              ...component,
              linking: [action.dependency!], // TODO: Tech debt
            };
          }
          return component;
        },
      );
    }
    case 'PROMOTING_COMPONENT': {
      return state.map(
        (component): ComponentData => {
          if (component.name === action.name) {
            return {
              ...component,
              promoting: action.environment,
            };
          }
          return component;
        },
      );
    }
    case 'FAVOURITE_COMPONENT': {
      return state.map(
        (component): ComponentData => {
          if (component.name === action.name) {
            return {
              ...component,
              favourite: action.favourite!, // TODO: Tech debt
            };
          }
          return component;
        },
      );
    }
    default:
      return state;
  }
};

export default reducer;
