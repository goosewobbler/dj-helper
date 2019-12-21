import { mount } from 'enzyme';
import * as React from 'react';

import { receiveComponent } from '../../src/client/actions/components';
import ComponentActions from '../../src/client/components/ComponentActions';
import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import renderApp from './mocks/app';
import mockFetch from './mocks/fetch';

const render = (state: ComponentState) => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state,
    useCache: false,
  };

  return mount(
    <ComponentActions
      theme={{}}
      component={component}
      editors={[]}
      onClone={jest.fn()}
      onOpenInCode={jest.fn()}
      onInstall={jest.fn()}
      onSetUseCache={jest.fn()}
      onBuild={jest.fn()}
    />,
  );
};

test('the stopped state label is rendered.', () => {
  const wrapper = render(ComponentState.Stopped);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('NOT RUNNING');
});

test('the installing state label is rendered.', () => {
  const wrapper = render(ComponentState.Installing);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('INSTALLING');
});

test('the building state label is rendered.', () => {
  const wrapper = render(ComponentState.Building);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('BUILDING');
});

test('the linking state label is rendered.', () => {
  const wrapper = render(ComponentState.Linking);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('LINKING');
});

test('the starting state label is rendered.', () => {
  const wrapper = render(ComponentState.Starting);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('STARTING');
});

test('the running state label is rendered.', () => {
  const wrapper = render(ComponentState.Running);
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('RUNNING');
});

test('can recieve new state from update', () => {
  const components: IComponentData[] = [
    {
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType: '0.12',
      state: ComponentState.Running,
      useCache: false,
    },
  ];

  mockFetch();
  const { wrapper, store } = renderApp(components);
  const componentListItem = wrapper.find(ComponentListItem).at(0);
  componentListItem.simulate('click');
  const label = wrapper.find('.state-label');

  expect(label.text()).toBe('RUNNING');

  store.dispatch(
    receiveComponent({
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType: '0.12',
      state: ComponentState.Building,
      useCache: false,
    }),
  );

  expect(label.text()).toBe('BUILDING');
});
