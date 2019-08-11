import { applyMiddleware, createStore as createReduxStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import { AppState } from '../common/types';

const createDefaultState = (): AppState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const createStore = (initialState?: AppState) =>
  createReduxStore<AppState, any, any, any>(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware(thunkMiddleware),
  );

export default createStore;
