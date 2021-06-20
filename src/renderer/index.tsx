import { ipcRenderer } from 'electron';
import React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider, ConnectedComponent } from 'react-redux';
import { AppContainer } from 'react-hot-loader';
import io from 'socket.io-client';
import { fetchVersions } from './actions/components';
import { receiveComponent, receiveComponents, receiveEditors } from './actions/app';
import App from './components/App';
import createReduxStore from './reduxStore';
import { ComponentData, ComponentsData, AppState } from '../common/types';
import '../css/tailwind.src.pcss';
import { AppProps } from './components/App/App';

const isDev = process.env.NODE_ENV === 'development';

declare global {
  interface Window {
    mdc: { preloadedState: AppState; componentPort: number };
  }
}

// const initDebugMode = async (): Promise<void> => {
//   Object.defineProperty(React, 'createClass', {
//     set: (): null => null,
//   });
//   const { whyDidYouUpdate } = await import('why-did-you-update');

//   whyDidYouUpdate(React, {
//     include: /ComponentListItem/,
//   });
// };

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  // initDebugMode();
}

type AppSetup = {
  html: string;
  initialState: AppState;
  componentPort: number;
};

ipcRenderer.once('app-setup', (appSetupEvent, { initialState, html, componentPort }: AppSetup): void => {
  const reduxStore = createReduxStore(initialState);
  const htmlRoot = document.getElementById('app') as HTMLElement;
  htmlRoot.innerHTML = html;

  if (!initialState) {
    ipcRenderer.once('components-data', (componentsDataEvent, componentsData: ComponentsData): void => {
      reduxStore.dispatch(receiveComponents(componentsData.components));
      reduxStore.dispatch(receiveEditors(componentsData.editors));
    });
    ipcRenderer.send('get-components-data');
  }

  const render = (
    Component: ConnectedComponent<(props: AppProps) => React.ReactElement, { componentPort: number }>,
  ): void => {
    ReactDOM.hydrate(
      <AppContainer>
        <Provider store={reduxStore}>
          <Component componentPort={componentPort} />
        </Provider>
      </AppContainer>,
      document.getElementById('app'),
    );
  };

  render(App);

  const inputElement = document.getElementById('search-input');
  if (inputElement) {
    inputElement.focus();
  }

  if (isDev) {
    // eslint-disable-next-line
    (module as any).hot?.accept('./components/App', () => {
      void import('./components/App').then((hotApp) => render(hotApp.default));
    });
  }

  if (io) {
    const socket = io(`http://localhost:${componentPort}`);
    socket.on('component', (component: ComponentData): void => {
      reduxStore.dispatch(receiveComponent(component));
    });

    const updateSelected = (): void => {
      const selected = (reduxStore.getState() as AppState).ui.selectedComponent;
      if (selected) {
        reduxStore.dispatch(fetchVersions(selected));
      }
    };

    socket.on('freshState', (freshState: ComponentsData): void => {
      reduxStore.dispatch(receiveComponents(freshState.components));
      reduxStore.dispatch(receiveEditors(freshState.editors));
      updateSelected();
    });

    setInterval((): void => {
      updateSelected();
    }, 60000);
  }
});

ipcRenderer.send('get-app-setup');
