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
  receiveTheme,
  updateAndSelectComponent,
  updateAvailable,
  updated,
  updating,
} from './client/actions/components';
import App from './client/containers/AppContainer';
import createStore from './client/store';

if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  Object.defineProperty(React, 'createClass', {
    set: nextCreateClass => null,
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
    .then(response => response.json())
    .then(json => {
      store.dispatch(receiveComponents(json.components));
      store.dispatch(receiveEditors(json.editors));
    });
}

const render = (Component: any) =>
  ReactDOM.render(
    <AppContainer>
      <Provider store={store}>
        <Component />
      </Provider>
    </AppContainer>,
    document.getElementById('app'),
  );

render(App);

const inputElement = document.getElementById('search-input');
if (inputElement) {
  inputElement.focus();
}

if ((module as any).hot) {
  (module as any).hot.accept('./client/containers/AppContainer', () => {
    render(require('./client/containers/AppContainer').default);
  });
}

if (io) {
  const socket = io('http://localhost:3333');
  socket.on('component', (component: any) => {
    store.dispatch(receiveComponent(component));
  });

  socket.on('updated', () => {
    store.dispatch(updated());
  });

  const updateSelected = () => {
    const selected = store.getState().ui.selectedComponent;
    if (selected) {
      store.dispatch(fetchVersions(selected));
    }
  };

  socket.on('freshState', (freshState: any) => {
    store.dispatch(receiveComponents(freshState.components));
    store.dispatch(receiveEditors(freshState.editors));
    updateSelected();
  });

  setInterval(() => {
    updateSelected();
  }, 60000);
}

const checkOutOfDate = () => {
  fetch('http://localhost:3333/api/status')
    .then(response => response.json())
    .then(response => {
      if (response.updated) {
        store.dispatch(updated());
      } else if (response.updating) {
        store.dispatch(updating());
      }
      if (response.updateAvailable) {
        store.dispatch(updateAvailable());
      }
    })
    .catch(console.error);
};

checkOutOfDate();

if (window.location.port === '8080') {
  (window as any).historyEnabled = false;
}

if (typeof (window as any).historyEnabled === 'undefined') {
  (window as any).historyEnabled = true;

  const selectComponentFromUrl = () => {
    const matches = /\/component\/(.+)$/.exec(String(window.document.location));
    if (matches) {
      store.dispatch(updateAndSelectComponent(matches[1], true));
    }
  };

  window.onpopstate = event => {
    selectComponentFromUrl();
  };

  selectComponentFromUrl();
}
