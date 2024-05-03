// import process from 'node:process';
// import url from 'node:url';
// import path from 'node:path';

import { contextBridge, ipcRenderer } from 'electron';

import { preloadZustandBridge } from 'zutron/preload';
import { AppState } from '../common/types.js';

const { handlers } = preloadZustandBridge<AppState>(ipcRenderer);

contextBridge.exposeInMainWorld('zutron', handlers);

// const validChannels = ['init-browsers', 'update-window-bounds', 'window-resized'];

// const listeners = validChannels.reduce((result: { [key: string]: string[] }, channel: string) => {
//   result[channel] = [];
//   return result;
// }, {});

// const invoke = (channel: string, ...data: unknown[]): Promise<unknown> =>
//   validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

// const on = (channel: string, listener: () => void): IpcRenderer | undefined => {
//   if (!validChannels.includes(channel) || listeners[channel].includes(listener.toString())) {
//     return undefined;
//   }
//   listeners[channel].push(listener.toString());
//   return ipcRenderer.on(channel, listener);
// };

// contextBridge.exposeInMainWorld('api', {
//   isDev: process.env.NODE_ENV === 'development',
//   invoke,
//   on,
// });

// contextBridge.exposeInMainWorld('__dirname', path.dirname(url.fileURLToPath(import.meta.url)));
