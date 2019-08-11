import * as React from 'react';
import { renderToString } from 'react-dom/server'; // tslint:disable-line no-submodule-imports
import { Provider } from 'react-redux';

import App from '../../client/components/App';
import createStore from '../../client/store';
import { Service } from '../service';
import { AppState } from '../../common/types';

const renderIndex = async (service: Service, template: string, selectedComponent?: string): Promise<string> => {
  const summaryData = await service.getComponentsSummaryData();

  const initialState: AppState = {
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
