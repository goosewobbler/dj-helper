import { applyMiddleware, createStore as createReduxStore, Action } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import { AppState } from '../common/types';

const createDefaultState = (): AppState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const createStore = (initialState?: AppState): void =>
  createReduxStore<AppState, Action<void>, any, any>(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware(thunkMiddleware),
  );

export default createStore;
