import { contextBridge, IpcRenderer, ipcRenderer } from 'electron';
import process from 'process';
import '@goosewobbler/electron-redux/preload';
import '@goosewobbler/spectron/preload';

const validChannels = [
  'play-track',
  'pause-track',
  'load-track',
  'init-browsers',
  'resize-browsers',
  'handle-autoplay',
  'update-window-bounds',
  'window-resized',
];

const invoke = (channel: string, ...data: unknown[]): Promise<unknown> =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

const on = (channel: string, listener: () => void): IpcRenderer | undefined =>
  validChannels.includes(channel) ? ipcRenderer.on(channel, listener) : undefined;

const removeAllListeners = (channel: string): IpcRenderer | undefined =>
  validChannels.includes(channel) ? ipcRenderer.removeAllListeners(channel) : undefined;

contextBridge.exposeInMainWorld('api', {
  isDev: process.env.NODE_ENV === 'development',
  invoke,
  on,
  removeAllListeners,
});
