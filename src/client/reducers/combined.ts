import { combineReducers } from 'redux';
import IState from '../types/IState';
import components from './components';
import ui from './ui';

const reducer = combineReducers<IState>({
  components,
  ui,
});

export default reducer;
