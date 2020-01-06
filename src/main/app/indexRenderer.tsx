import * as React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';

import App from '../../renderer/components/App';
import createReduxStore from '../../renderer/reduxStore';
import { AppState, Store, Service } from '../../common/types';

const renderIndex = (service: Service, config: Store, template: string, selectedComponent?: string): string => {
  const summaryData = service.getComponentsSummaryData();
  const theme = service.getTheme();

  const initialState: AppState = {
    components: summaryData.components,
    ui: {
      editors: summaryData.editors,
      theme,
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
  const extraCSS = `mark{background-color:${theme.highlightColour};}`;
  const preloadedStateString = JSON.stringify(preloadedState).replace(/</g, '\\u003c');
  const apiPortString = apiPort.toString();

  return template
    .replace('HTML_PLACEHOLDER', html)
    .replace('/* CSS_PLACEHOLDER */', extraCSS)
    .replace('/* API_PORT_PLACEHOLDER */', `window.mdc.apiPort = ${apiPortString}`)
    .replace('/* STATE_PLACEHOLDER */', `window.mdc.preloadedState = ${preloadedStateString}`);
};

export default renderIndex;
