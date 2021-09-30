import { contextBridge } from 'electron';
import process from 'process';
import '@goosewobbler/electron-redux/preload';
import '@goosewobbler/spectron/preload';

// const validChannels = ['play-track', 'pause-track'];

// const invoke = (channel: string, ...data: unknown[]): Promise<unknown> =>
//   validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

contextBridge.exposeInMainWorld('api', {
  isDev: process.env.NODE_ENV === 'development',
  //  invoke,
});
