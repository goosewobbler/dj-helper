import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import { AppState, Dispatch } from '../common/types';

const createDefaultState = (): AppState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const createReduxStore = (initialState?: AppState): Store =>
  createStore(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware<Dispatch, AppState>(thunkMiddleware),
  );

export default createReduxStore;
