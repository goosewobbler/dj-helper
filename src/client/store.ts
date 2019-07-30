import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import { ComponentData } from '../common/types';

interface State {
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
  };
}

const createDefaultState = (): State => ({
  components: [],
  ui: {
    editors: [],
  },
});

const store = (initialState?: State) =>
  createStore<State, any, any, any>(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware(thunkMiddleware),
  );

export { store };
