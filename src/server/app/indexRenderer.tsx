import * as React from 'react';
import { renderToString } from 'react-dom/server'; // tslint:disable-line no-submodule-imports
import { Provider } from 'react-redux';

import App from '../../client/containers/AppContainer';
import createStore from '../../client/store';
import IState from '../../client/types/IState';
import Theme from '../../types/Theme';
import IService from '../types/IService';

const renderIndex = async (
  service: IService,
  template: string,
  theme: Theme,
  selectedComponent?: string,
): Promise<string> => {
  const summaryData = await service.getComponentsSummaryData();

  const initialState: IState = {
    components: summaryData.components,
    ui: {
      editors: summaryData.editors,
      theme: summaryData.theme,
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

  const extraCSS = `mark{background-color:${theme.highlightColour};}`;

  return template
    .replace('HTML_PLACEHOLDER', html)
    .replace('STATE_PLACEHOLDER', JSON.stringify(preloadedState).replace(/</g, '\\u003c'));
};

export default renderIndex;
