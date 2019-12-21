import { mount } from 'enzyme';
import * as React from 'react';
import { Provider } from 'react-redux';

import { receiveComponents } from '../../../src/client/actions/components';
import AppContainer from '../../../src/client/containers/AppContainer';
import createStore from '../../../src/client/store';
import IComponentData from '../../../src/types/IComponentData';
import { createMockComponents } from './components';

const render = (components?: IComponentData[]) => {
  const defaultedComponents = components || createMockComponents();
  const store = createStore();
  const wrapper = mount(
    <Provider store={store}>
      <AppContainer />
    </Provider>,
  );

  store.dispatch(receiveComponents(defaultedComponents));

  return {
    components: defaultedComponents,
    store,
    wrapper,
  };
};

export default render;
