import { contextBridge, ipcRenderer } from 'electron';
import '@goosewobbler/electron-redux/preload';
import '@goosewobbler/spectron/preload';

const validChannels = ['get-store-value'];

const invoke = (channel: string, ...data: unknown[]) =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

contextBridge.exposeInMainWorld('api', {
  store: {
    getValue: async (key: string) => invoke('get-store-value', key),
  },
});

if (process.env.NODE_ENV === 'test') {
  contextBridge.exposeInMainWorld('electronRequire', require);
}
