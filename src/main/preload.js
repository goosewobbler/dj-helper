const { contextBridge, ipcRenderer } = require('electron');
require('@mckayla/electron-redux/preload');

const validChannels = ['get-setup', 'get-store-value'];

/**
 * @param {string} channel * @param {any[]} data */

const invoke = (channel, ...data) =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

contextBridge.exposeInMainWorld('api', {
  app: {
    getSetup: async () => invoke('get-setup'),
  },
  store: {
    /**
     * @param {string} key */
    getValue: async (key) => invoke('get-store-value', key),
  },
});
