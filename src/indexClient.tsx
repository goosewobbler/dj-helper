import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import io from 'socket.io-client';
import { fetchVersions, updateAndSelectComponent } from './client/actions/components';
import {
  receiveComponent,
  receiveComponents,
  receiveEditors,
  updateAvailable,
  updated,
  updating,
} from './client/actions/app';
import App from './client/components/App';
import createReduxStore from './client/reduxStore';
import { logError } from './server/helpers/console';
import { ComponentData, AppStatus, ComponentsData, AppState } from './common/types';

declare global {
  interface Window {
    historyEnabled: boolean;
    mdc: { preloadedState: AppState; apiPort: number };
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

const { preloadedState, apiPort } = window.mdc;

delete window.mdc.preloadedState;

const reduxStore = createReduxStore(preloadedState);

if (!preloadedState) {
  fetch(`http://localhost:${apiPort}/api/component`)
    .then((response): Promise<ComponentsData> => response.json())
    .then((json): void => {
      reduxStore.dispatch(receiveComponents(json.components));
      reduxStore.dispatch(receiveEditors(json.editors));
    });
}

ReactDOM.render(
  <Provider store={reduxStore}>
    <App />
  </Provider>,
  document.getElementById('root'),
);

const inputElement = document.getElementById('search-input');
if (inputElement) {
  inputElement.focus();
}

if (io) {
  const socket = io(`http://localhost:${apiPort}`);
  socket.on('component', (component: ComponentData): void => {
    reduxStore.dispatch(receiveComponent(component));
  });

  socket.on('updated', (): void => {
    reduxStore.dispatch(updated());
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

const checkOutOfDate = (): void => {
  fetch(`http://localhost:${apiPort}/api/status`)
    .then((response): Promise<AppStatus> => response.json())
    .then((response): void => {
      if (response.updated) {
        reduxStore.dispatch(updated());
      } else if (response.updating) {
        reduxStore.dispatch(updating());
      }
      if (response.updateAvailable) {
        reduxStore.dispatch(updateAvailable());
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
      reduxStore.dispatch(updateAndSelectComponent(matches[1], true));
    }
  };

  window.onpopstate = (): void => {
    selectComponentFromUrl();
  };

  selectComponentFromUrl();
}
