import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import * as io from 'socket.io-client';
import {
  fetchVersions,
  receiveComponent,
  receiveComponents,
  receiveEditors,
  updateAndSelectComponent,
  updateAvailable,
  updated,
  updating,
} from './client/actions/components';
import App from './client/components/App';
import createStore from './client/store';
import { logError } from './server/helpers/console';
import { ComponentData, AppStatus, ComponentsData, AppState } from './common/types';

declare global {
  interface Window {
    historyEnabled: boolean;
    mdc: { preloadedState: AppState };
  }
}

const initDebugMode = async (): Promise<void> => {
  Object.defineProperty(React, 'createClass', {
    set: (): void => null,
  });
  const { whyDidYouUpdate } = await import('why-did-you-update');

  whyDidYouUpdate(React, {
    include: /ComponentListItem/,
  });
};

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  initDebugMode();
}

const { preloadedState } = window.mdc;

delete window.mdc.preloadedState;

const store = createStore(preloadedState);

if (!preloadedState) {
  fetch('http://localhost:3333/api/component')
    .then((response): Promise<ComponentsData> => response.json())
    .then((json): void => {
      store.dispatch(receiveComponents(json.components));
      store.dispatch(receiveEditors(json.editors));
    });
}

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

const inputElement = document.getElementById('search-input');
if (inputElement) {
  inputElement.focus();
}

if (io) {
  const socket = io('http://localhost:3333');
  socket.on('component', (component: ComponentData): void => {
    store.dispatch(receiveComponent(component));
  });

  socket.on('updated', (): void => {
    store.dispatch(updated());
  });

  const updateSelected = (): void => {
    const selected = store.getState().ui.selectedComponent;
    if (selected) {
      store.dispatch(fetchVersions(selected));
    }
  };

  socket.on('freshState', (freshState: ComponentsData): void => {
    store.dispatch(receiveComponents(freshState.components));
    store.dispatch(receiveEditors(freshState.editors));
    updateSelected();
  });

  setInterval((): void => {
    updateSelected();
  }, 60000);
}

const checkOutOfDate = (): void => {
  fetch('http://localhost:3333/api/status')
    .then((response): Promise<AppStatus> => response.json())
    .then((response): void => {
      if (response.updated) {
        store.dispatch(updated());
      } else if (response.updating) {
        store.dispatch(updating());
      }
      if (response.updateAvailable) {
        store.dispatch(updateAvailable());
      }
    })
    .catch(logError);
};

checkOutOfDate();

if (window.location.port === '8080') {
  window.historyEnabled = false;
}

if (typeof window.historyEnabled === 'undefined') {
  window.historyEnabled = true;

  const selectComponentFromUrl = (): void => {
    const matches = /\/component\/(.+)$/.exec(String(window.document.location));
    if (matches) {
      store.dispatch(updateAndSelectComponent(matches[1], true));
    }
  };

  window.onpopstate = (): void => {
    selectComponentFromUrl();
  };

  selectComponentFromUrl();
}
