/// <reference types="@welldone-software/why-did-you-render" />
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
        getSetup: Function;
      };
    };
  }
}

// const initDebugMode = async (): Promise<void> => {
//   const whyDidYouRender = (await import('@welldone-software/why-did-you-render')).default;
//   whyDidYouRender(React, {
//     trackAllPureComponents: true,
//   });
// };

// if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
//   initDebugMode();
// }

const { initialState, html } = await window.api.app.getSetup();

const reduxStore = createReduxStore(initialState, syncRenderer);
const htmlRoot = document.getElementById('app') as HTMLElement;
htmlRoot.innerHTML = html;

ReactDOM.hydrate(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById('app'),
);

// if (isDev) {
//   // eslint-disable-next-line
//   (module as any).hot?.accept('./App', () => {
//     void import('./App').then((hotApp) => render(hotApp.default));
//   });
// }
