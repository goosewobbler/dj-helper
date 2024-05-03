import { handlers as browsersHandlers } from './browsers/index.js';
import { handlers as embedHandlers } from './embed/index.js';
import { handlers as listsHandlers } from './lists/index.js';
import { handlers as tracksHandlers } from './tracks/index.js';
import { handlers as uiHandlers } from './ui/index.js';
import { AppState, AppStore } from '../common/types.js';

export const getHandlers = (store: AppStore, initialState: AppState) => ({
  ...browsersHandlers(store),
  ...embedHandlers(store),
  ...listsHandlers(store),
  ...tracksHandlers(store),
  ...uiHandlers(store),
  'STORE:RESET': () => store.setState(initialState, true),
});
