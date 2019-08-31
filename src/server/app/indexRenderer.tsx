import * as React from 'react';
import { renderToString } from 'react-dom/server'; // tslint:disable-line no-submodule-imports
import { Provider } from 'react-redux';

import App from '../../client/components/App';
import createReduxStore from '../../client/reduxStore';
import { Service } from '../service';
import { AppState, Store } from '../../common/types';

const renderIndex = async (
  service: Service,
  config: Store,
  template: string,
  selectedComponent?: string,
): Promise<string> => {
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

  const reduxStore = createReduxStore(initialState);

  const html = renderToString(
    <Provider store={reduxStore}>
      <App />
    </Provider>,
  );

  const preloadedState = reduxStore.getState();
  const apiPort = config.get('apiPort') as string;

  return template
    .replace('HTML_PLACEHOLDER', html)
    .replace('API_PORT_PLACEHOLDER', apiPort)
    .replace('STATE_PLACEHOLDER', JSON.stringify(preloadedState).replace(/</g, '\\u003c'));
};

export default renderIndex;
