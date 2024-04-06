import { createUseDispatch } from 'zutron';
import { AppState } from '../../common/types.js';

export const useDispatch = () => createUseDispatch<AppState>(window.zutron);
