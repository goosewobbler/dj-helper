import { contextBridge, ipcRenderer } from 'electron';
import process from 'process';
import '@goosewobbler/electron-redux/preload';
import '@goosewobbler/spectron/preload';
import { Bounds } from '../main/trackEmbed';

const validChannels = ['create-track-embed'];

const invoke = (channel: string, ...data: unknown[]): Promise<unknown> =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

contextBridge.exposeInMainWorld('api', {
  isDev: process.env.NODE_ENV === 'development',
  track: {
    createEmbed: async (url: string, bounds: Bounds): Promise<unknown> => invoke('create-track-embed', url, bounds),
  },
});
