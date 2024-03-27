import { createUseStore } from 'zutron';
import { RootState } from '../../features/rootReducer.js';

export const useStore = createUseStore<RootState>(window.zutron);
