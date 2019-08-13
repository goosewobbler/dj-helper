import { applyMiddleware, createStore as createReduxStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import { AppState, Dispatch } from '../common/types';

const createDefaultState = (): AppState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const createStore = (initialState?: AppState): Store =>
  createReduxStore(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware<Dispatch, AppState>(thunkMiddleware),
  );

export default createStore;
