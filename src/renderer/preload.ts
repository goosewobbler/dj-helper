import { contextBridge, IpcRenderer, ipcRenderer } from 'electron';
import process from 'process';
import '@goosewobbler/electron-redux/preload';
// import '@goosewobbler/spectron/preload';

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

const listeners = validChannels.reduce((result: { [key: string]: string[] }, channel: string) => {
  result[channel] = [];
  return result;
}, {});

const invoke = (channel: string, ...data: unknown[]): Promise<unknown> =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

const on = (channel: string, listener: () => void): IpcRenderer | undefined => {
  if (!validChannels.includes(channel) || listeners[channel].includes(listener.toString())) {
    return undefined;
  }
  listeners[channel].push(listener.toString());
  return ipcRenderer.on(channel, listener);
};

contextBridge.exposeInMainWorld('api', {
  isDev: process.env.NODE_ENV === 'development',
  invoke,
  on,
});
