import { Store } from '@reduxjs/toolkit';
import { IpcRenderer } from 'electron';
import React from 'react';
import { Provider } from 'react-redux';
import * as ReactDOM from 'react-dom';
import { syncRenderer } from '@goosewobbler/electron-redux/renderer';
import { App } from './App';
import { createReduxStore } from '../common/reduxStore';
import '../css/tailwind.src.pcss';
import 'allotment/dist/style.css';

declare global {
  interface Window {
    api: {
      isDev: boolean;
      invoke(channel: string, ...data: unknown[]): Promise<unknown>;
      on(channel: string, listener: (...args: unknown[]) => void): IpcRenderer | undefined;
      removeAllListeners(channel: string): IpcRenderer | undefined;
    };
  }
}

function render(reduxStore: Store): void {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <App />
    </Provider>,
    document.getElementById('app'),
  );
}

void (async () => {
  const reduxStore = await createReduxStore({
    context: 'renderer',
    syncFn: syncRenderer,
  });
  render(reduxStore);
})();

// if (isDev) {
//   // eslint-disable-next-line
//   (module as any).hot?.accept('./App', () => {
//     void import('./App').then((hotApp) => render(hotApp.default));
//   });
// }

// const isDev = process.env.NODE_ENV === 'development';

// if (isDev) {
//   (module as any).hot?.accept(); //eslint-disable-line
// }
