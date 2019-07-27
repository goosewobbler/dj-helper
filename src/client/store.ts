import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import combinedReducer from './reducers/combined';
import IState from './types/IState';

const createDefaultState = (): IState => ({
  components: [],
  ui: {
    editors: [],
  },
});

const store = (initialState?: IState) =>
  createStore<IState, any, any, any>(
    combinedReducer,
    initialState || createDefaultState(),
    applyMiddleware(thunkMiddleware),
  );

export default store;
