import { mount } from 'enzyme';
import * as React from 'react';
import ComponentDependencies from '../../src/client/components/ComponentDependencies';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';

const render = (onLinkComponent?: any, onUnlinkComponent?: any, state?: ComponentState) => {
  const component: IComponentData = {
    dependencies: [
      {
        displayName: 'foo',
        has: null,
        latest: null,
        linked: false,
        name: 'bbc-morph-foo',
        outdated: false,
        rendererType: '0.12',
        version: '^1.0.0',
      },
      {
        displayName: 'bar',
        has: null,
        latest: null,
        linked: false,
        name: 'bbc-morph-bar',
        outdated: false,
        rendererType: '0.12',
        version: '^1.0.0',
      },
      {
        displayName: 'hello',
        has: '1.2.3',
        latest: '1.2.3',
        linked: true,
        name: 'bbc-morph-hello',
        outdated: true,
        rendererType: '0.12',
        version: '^1.0.0',
      },
    ],
    displayName: 'test',
    favorite: false,
    linking: ['bbc-morph-foo'],
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state,
    useCache: false,
  };

  return mount(
    <ComponentDependencies
      component={component}
      theme={{}}
      onSelectComponent={jest.fn()}
      onLinkComponent={onLinkComponent}
      onUnlinkComponent={onUnlinkComponent}
    />,
  );
};

test('The list of dependencies are displayed in alphabetical order.', () => {
  const wrapper = render(jest.fn(), jest.fn(), ComponentState.Running);
  const names = wrapper.find('.component-name-label').map((item) => item.text());

  expect(names).toEqual(['bar', 'foo', 'hello']);
});

test('Can link unlinked dependencies.', () => {
  const onLinkComponent = jest.fn();
  const wrapper = render(onLinkComponent, jest.fn(), ComponentState.Running);
  const linkButton = wrapper.find('.component-link-button').at(0);
  linkButton.simulate('click');

  expect(onLinkComponent).toHaveBeenCalledTimes(1);
  expect(onLinkComponent).toHaveBeenCalledWith('bbc-morph-test', 'bbc-morph-bar');
});

test('Can unlink linked dependencies.', () => {
  const onUnlinkComponent = jest.fn();
  const wrapper = render(jest.fn(), onUnlinkComponent, ComponentState.Running);
  const unlinkButton = wrapper.find('.component-unlink-button').at(0);
  unlinkButton.simulate('click');

  expect(onUnlinkComponent).toHaveBeenCalledTimes(1);
  expect(onUnlinkComponent).toHaveBeenCalledWith('bbc-morph-test', 'bbc-morph-hello');
});

test('Linking dependencies cannot be linked or unlinked.', () => {
  const wrapper = render(jest.fn(), jest.fn(), ComponentState.Running);
  const dependency = wrapper.find('li').at(1);

  expect(dependency.find('.component-link-button').exists()).toBe(false);
  expect(dependency.find('.component-unlink-button').exists()).toBe(false);
});

test('Can render without dependencies', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    linking: ['bbc-morph-foo'],
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
  };

  const wrapper = mount(
    <ComponentDependencies
      component={component}
      theme={{}}
      onSelectComponent={jest.fn()}
      onLinkComponent={jest.fn()}
      onUnlinkComponent={jest.fn()}
    />,
  );
  const dependency = wrapper.find('li');

  expect(dependency.exists()).toBe(false);
});

test('Cannot link or unlink when stopped', () => {
  const onLinkComponent = jest.fn();
  const wrapper = render(onLinkComponent, jest.fn(), ComponentState.Stopped);
  const linkButton = wrapper.find('.component-link-button');
  const unlinkButton = wrapper.find('.component-unlink-button');

  expect(linkButton.exists()).toBe(false);
  expect(unlinkButton.exists()).toBe(false);
});
