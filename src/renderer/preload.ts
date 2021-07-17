import { contextBridge } from 'electron';
import process from 'process';
import '@goosewobbler/electron-redux/preload';
import '@goosewobbler/spectron/preload';

contextBridge.exposeInMainWorld('api', {
  isDev: process.env.NODE_ENV === 'development',
});
