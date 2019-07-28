import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import IState from './types/IState';

const INITIAL_THEME: any = {};

const createDefaultState = (): IState => ({
  components: [],
  ui: {
    editors: [],
    theme: INITIAL_THEME,
  },
});

const store = (initialState?: IState) =>
  createStore<IState, any, any, any>(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware(thunkMiddleware),
  );

export default store;
