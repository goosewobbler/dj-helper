import { applyMiddleware, createStore, Store } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import combinedReducer from './reducers/combined';
import { AppState, Dispatch } from '../common/types';

const createDefaultState = (): AppState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const createReduxStore = (initialState?: AppState): Store => {
  const isDev = process.env.NODE_ENV !== 'production' || process.env.DEBUG_PROD;
  const composeEnhancers = composeWithDevTools({
    trace: true,
  });
  const storeEnhancer = applyMiddleware<Dispatch, AppState>(thunkMiddleware);

  return createStore(
    combinedReducer,
    initialState || createDefaultState(),
    isDev ? composeEnhancers(storeEnhancer) : storeEnhancer,
  );
};

export default createReduxStore;
