import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
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
import App from './client/components/App/app-container';
import { createStore } from './client/store';
import { logError } from './server/helpers/console';
import { ComponentData, AppStatus, ComponentsData } from './common/types';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  Object.defineProperty(React, 'createClass', {
    set: (): void => null,
  });
  const { whyDidYouUpdate } = require('why-did-you-update');
  whyDidYouUpdate(React, {
    include: 'ComponentListItem',
  });
}

const preloadedState = (window as any).__PRELOADED_STATE__;

delete (window as any).__PRELOADED_STATE__;

const store = createStore(preloadedState);

if (!preloadedState) {
  fetch('http://localhost:3333/api/component')
    .then((response): Promise<ComponentsData> => response.json())
    .then((json): void => {
      store.dispatch(receiveComponents(json.components));
      store.dispatch(receiveEditors(json.editors));
    });
}

const render = (Component: any): void => {
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
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

if ((module as any).hot) {
  (module as any).hot.accept('./client/components/App/app-container', (): void => {
    render(require('./client/components/App/app-container').default);
  });
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

  socket.on('freshState', (freshState: any): void => {
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
  (window as any).historyEnabled = false;
}

if (typeof (window as any).historyEnabled === 'undefined') {
  (window as any).historyEnabled = true;

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
