import { combineReducers } from 'redux';
import components from './components';
import ui from './ui';
import { AppState } from '../../common/types';

const reducer = combineReducers<AppState>({
  components,
  ui,
});

export default reducer;
