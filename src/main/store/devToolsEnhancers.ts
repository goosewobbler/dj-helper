import type { StoreEnhancer } from 'redux';
import { devToolsEnhancer as base } from '@redux-devtools/remote';

export const devToolsEnhancer: StoreEnhancer = base({
  port: 3001,
  secure: false,
  realtime: true, // false when not dev
  suppressConnectErrors: true,
  hostname: 'localhost',
});
