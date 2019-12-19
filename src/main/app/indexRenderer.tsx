import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import App from '../../renderer/components/App';
import createReduxStore from '../../renderer/reduxStore';
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
  const apiPort = config.get('apiPort') as number;
  const html = renderToString(
    <Provider store={reduxStore}>
      <App apiPort={apiPort} />
    </Provider>,
  );

  const preloadedState = reduxStore.getState();
  return template
    .replace('HTML_PLACEHOLDER', html)
    .replace('API_PORT_PLACEHOLDER', apiPort.toString())
    .replace('STATE_PLACEHOLDER', JSON.stringify(preloadedState).replace(/</g, '\\u003c'));
};

export default renderIndex;
