import { mount } from 'enzyme';
import * as React from 'react';

import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';

const render = (state: ComponentState) => {
  return mount(
    <ComponentListItem
      name="bbc-morph-test"
      displayName="test"
      state={state}
      url="http://test"
      favourite={false}
      theme={{}}
      selected={false}
    />,
  );
};

test('The launch button is not displayed when the component is not running.', () => {
  const wrapper = render(ComponentState.Stopped);
  const launchButton = wrapper.find('.launch-button');

  expect(launchButton.exists()).toBe(false);
});

test('The launch button is displayed when the component is running.', () => {
  const wrapper = render(ComponentState.Running);
  const launchButton = wrapper.find('.launch-button');

  expect(launchButton.exists()).toBe(true);
  expect(launchButton.prop('href')).toBe('http://test');
});

test('The launch button links to the base url if the history is empty.', () => {
  const wrapper = render(ComponentState.Running);
  const launchButton = wrapper.find('.launch-button');

  expect(launchButton.prop('href')).toBe('http://test');
});
