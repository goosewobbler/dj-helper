const { contextBridge, ipcRenderer } = require('electron');
require('@goosewobbler/electron-redux/preload');

const validChannels = ['get-store-value'];

/**
 * @param {string} channel * @param {any[]} data */

const invoke = (channel, ...data) =>
  validChannels.includes(channel) ? ipcRenderer.invoke(channel, data) : Promise.reject();

contextBridge.exposeInMainWorld('api', {
  store: {
    /**
     * @param {string} key */
    getValue: async (key) => invoke('get-store-value', key),
  },
});
