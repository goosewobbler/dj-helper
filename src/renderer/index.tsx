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
import '../css/tailwind.src.css';

declare global {
  interface Window {
    mdc: { preloadedState: AppState; apiPort: number };
  }
}

const initDebugMode = async (): Promise<void> => {
  Object.defineProperty(React, 'createClass', {
    set: (): null => null,
  });
  const { whyDidYouUpdate } = await import('why-did-you-update');

  whyDidYouUpdate(React, {
    include: /ComponentListItem/,
  });
};

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  initDebugMode();
}

const { preloadedState, apiPort } = window.mdc;

delete window.mdc.preloadedState;

const reduxStore = createReduxStore(preloadedState);

if (!preloadedState) {
  ipcRenderer.once('components-data', (event, componentsData: ComponentsData): void => {
    reduxStore.dispatch(receiveComponents(componentsData.components));
    reduxStore.dispatch(receiveEditors(componentsData.editors));
  });
  ipcRenderer.send('get-components-data');
}

const render = (Component: ConnectedComponent<any, any>): void => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={reduxStore}>
        <Component />
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

if (module.hot) {
  module.hot.accept('./components/App', () => {
    import('./components/App').then(hotApp => render(hotApp.default));
  });
}

if (io) {
  const socket = io(`http://localhost:${apiPort}`);
  socket.on('component', (component: ComponentData): void => {
    reduxStore.dispatch(receiveComponent(component));
  });

  const updateSelected = (): void => {
    const selected = reduxStore.getState().ui.selectedComponent;
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
