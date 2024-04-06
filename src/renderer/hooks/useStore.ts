import { createUseStore } from 'zutron';
import { AppState } from '../../common/types.js';

export const useStore = createUseStore<AppState>(window.zutron);
