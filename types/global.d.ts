declare module '*/tailwind.config';

import type { PreloadZustandBridgeReturn } from 'zutron';
import { AppState } from '../src/common/types.ts';

// import { Dispatch, AppState } from './types.js';

// export const useAppDispatch = () => useDispatch<Dispatch>();

declare global {
  interface Window {
    zutron: PreloadZustandBridgeReturn<AppState>['handlers'];
  }
}

export {};
