import { combineReducers } from 'redux';
import State from '../types/IState';
import components from './components';
import ui from './ui';

const reducer = combineReducers<State>({
  components,
  ui,
});

export default reducer;
