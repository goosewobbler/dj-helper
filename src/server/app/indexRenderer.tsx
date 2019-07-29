import * as React from 'react';
import { renderToString } from 'react-dom/server'; // tslint:disable-line no-submodule-imports
import { Provider } from 'react-redux';

import App from '../../client/containers/AppContainer';
import createStore from '../../client/store';
import IState from '../../client/types/IState';
import Service from '../types/Service';

const renderIndex = async (service: Service, template: string, selectedComponent?: string): Promise<string> => {
  const summaryData = await service.getComponentsSummaryData();

  const initialState: IState = {
    components: summaryData.components,
    ui: {
      editors: summaryData.editors,
    },
  };

  if (selectedComponent) {
    initialState.ui.selectedComponent = selectedComponent;
  }

  const store = createStore(initialState);

  const html = renderToString(
    <Provider store={store}>
      <App />
    </Provider>,
  );

  const preloadedState = store.getState();

  return template
    .replace('HTML_PLACEHOLDER', html)
    .replace('STATE_PLACEHOLDER', JSON.stringify(preloadedState).replace(/</g, '\\u003c'));
};

export default renderIndex;
