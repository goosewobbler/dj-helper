import { Store } from '@reduxjs/toolkit';
import { syncRenderer } from '@mckayla/electron-redux/renderer';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { AppState } from '../common/types';
import '../css/tailwind.src.pcss';
import { createReduxStore } from '../common/reduxStore';

declare global {
  interface Window {
    djHelper: { preloadedState: AppState };
    api: {
      app: {
        getSetup: () => Promise<{ html: string }>;
      };
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
  const reduxStore = createReduxStore({
    context: 'renderer',
    syncFn: syncRenderer,
    persistCallback: () => render(reduxStore),
  });
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
