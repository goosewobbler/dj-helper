import { mount } from 'enzyme';
import * as React from 'react';

import ComponentVersions from '../../src/client/components/ComponentVersions';
import ComponentType from '../../src/server/service/types/ComponentType';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';

const extract = (wrapper: any) =>
  wrapper.find('.environment-version').map((version: any) => ({
    environment: version.find('.environment-label').text(),
    version: version.find('.version-label').text(),
  }));

const render = (local: string, int: string, test: string, live: string, promoting: string = null) => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    promoting,
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
    versions: {
      int,
      live,
      local,
      test,
    },
  };

  return mount(<ComponentVersions theme={{}} component={component} />);
};

test('The versions and labels are rendered correctly.', () => {
  const wrapper = render('1.2.3', '2.1.0', '2.0.1', '2.0.0');
  const rendered = extract(wrapper);

  expect(rendered).toEqual([
    {
      environment: 'LOCAL',
      version: '1.2.3',
    },
    {
      environment: 'INT',
      version: '2.1.0',
    },
    {
      environment: 'TEST',
      version: '2.0.1',
    },
    {
      environment: 'LIVE',
      version: '2.0.0',
    },
  ]);
});

test('The loading spinner is displayed when fetching versions.', () => {
  const wrapper = render('1.2.3', null, null, '1.2.3');
  const rendered = extract(wrapper);

  expect(rendered).toEqual([
    {
      environment: 'LOCAL',
      version: '1.2.3',
    },
    {
      environment: 'LIVE',
      version: '1.2.3',
    },
  ]);

  expect(wrapper.find('.environment-loading').length).toBe(2);
});

test('All the loading spinners are displayed when there are no versions', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(wrapper.find('.environment-loading').length).toBe(4);
});

test('Can handle invalid versions', () => {
  const component: any = {
    displayName: 'test',
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
    versions: {
      int: 3,
      live: '^^^^22222',
      local: 'dsfkh',
      test: '2',
    },
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(wrapper.find('.environment-loading').length).toBe(4);
});

test('Can handle null local version', () => {
  const component: any = {
    displayName: 'test',
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
    versions: {
      int: '1.0.0',
      live: '1.0.0',
      local: null,
      test: '1.0.0',
    },
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(wrapper.find('.environment-loading').length).toBe(1);
});

test('Only LOCAL is current.', () => {
  const wrapper = render('2.0.0', '1.2.3', '1.2.3', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(false);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('Only LOCAL and INT are current.', () => {
  const wrapper = render('2.0.0', '2.0.0', '1.2.3', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('Only LOCAL, INT, and TEST are current.', () => {
  const wrapper = render('2.0.0', '2.0.0', '2.0.0', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(true);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('All environments are current when all the versions are the same.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.3', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(true);
  expect(environments.at(3).prop('data-test')).toBe(true);
});

test('INT is the only current.', () => {
  const wrapper = render('1.0.0', '1.2.3', '1.2.0', '1.0.0');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(false);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('INT and TEST are the only current.', () => {
  const wrapper = render('1.0.0', '1.2.3', '1.2.3', '1.0.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(false);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(true);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('INT, TEST, and LIVE are the only current.', () => {
  const wrapper = render('1.0.0', '1.2.3', '1.2.3', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(false);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(true);
  expect(environments.at(3).prop('data-test')).toBe(true);
});

test('TEST is the only not current.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.2', '1.2.3');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(true);
});

test('Current when only LOCAL available.', () => {
  const wrapper = render('1.2.3', '', '', '');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(false);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('Current when only LOCAL and INT available.', () => {
  const wrapper = render('1.2.3', '1.2.3', '', '');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(false);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('Current when only LOCAL, INT, and TEST available.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.3', '');
  const environments = wrapper.find('.environment-version');

  expect(environments.at(0).prop('data-test')).toBe(true);
  expect(environments.at(1).prop('data-test')).toBe(true);
  expect(environments.at(2).prop('data-test')).toBe(true);
  expect(environments.at(3).prop('data-test')).toBe(false);
});

test('The promote to Test button is displayed when the version on Int is behind.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.0.0', '1.0.0');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.length).toBe(1);
  expect(promoteButton.prop('data-test')).toBe('test');
  expect(promoteButton.text()).toBe('Promote');
});

test('The promote to Live button is displayed when the version on Test is behind.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.3', '1.0.0');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.length).toBe(1);
  expect(promoteButton.prop('data-test')).toBe('live');
  expect(promoteButton.text()).toBe('Promote');
});

test('A promote button is not displayed when all the versions are the same.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.3', '1.2.3');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.exists()).toBe(false);
});

test('A promote button is not displayed when the Int environment is loading.', () => {
  const wrapper = render('1.2.3', null, '1.1.3', '1.1.3');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.exists()).toBe(false);
});

test('A promote button is not displayed when the Test environment is loading.', () => {
  const wrapper = render('1.2.3', '1.2.3', null, '1.1.3');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.exists()).toBe(false);
});

test('A promote button is not displayed when the Live environment is loading.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.3', null);
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.exists()).toBe(false);
});

test('Both promote buttons can be displayed at the same time.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.0', '1.0.0');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.length).toBe(2);
  expect(promoteButton.at(0).prop('data-test')).toBe('test');
  expect(promoteButton.at(0).text()).toBe('Promote');
  expect(promoteButton.at(1).prop('data-test')).toBe('live');
  expect(promoteButton.at(1).text()).toBe('Promote');
});

test('Bump button is displayed.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.0', '1.0.0', null);
  const bumpButton = wrapper.find('.bump-button');

  expect(bumpButton.length).toBe(1);
  expect(bumpButton.text()).toBe('Bump');
});

test('When bumping.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.0', '1.0.0', 'int');
  const bumpButton = wrapper.find('.bump-button');

  expect(bumpButton.length).toBe(1);
  expect(bumpButton.text()).toBe('Bumping');
});

test('When promoting to TEST.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.0', '1.0.0', 'test');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.length).toBe(1);
  expect(promoteButton.prop('data-test')).toBe('test');
  expect(promoteButton.text()).toBe('Promoting');
});

test('When promoting to LIVE.', () => {
  const wrapper = render('1.2.3', '1.2.3', '1.2.0', '1.0.0', 'live');
  const promoteButton = wrapper.find('.promote-button');

  expect(promoteButton.length).toBe(1);
  expect(promoteButton.prop('data-test')).toBe('live');
  expect(promoteButton.text()).toBe('Promoting');
});

test('The promotion error is shown.', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    promotionFailure: 'fail',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
    versions: {
      int: '1.0.0',
      live: '1.0.0',
      local: '1.0.0',
      test: '1.0.0',
    },
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(wrapper.find('.promotion-failure').text()).toContain('😧');
  expect(wrapper.find('.promotion-failure').text()).toContain('Promotion failed');
  expect(wrapper.find('.promotion-failure').text()).toContain('fail');
  expect(
    wrapper
      .find('.promotion-failure')
      .find('a')
      .exists(),
  ).toBe(false);
});

test('The promotion error is wrapped in an anchor if it is a link.', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    promotionFailure: 'http://fail',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
    versions: {
      int: '1.0.0',
      live: '1.0.0',
      local: '1.0.0',
      test: '1.0.0',
    },
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(wrapper.find('.promotion-failure').text()).toContain('😧');
  expect(wrapper.find('.promotion-failure').text()).toContain('Promotion failed');
  expect(wrapper.find('.promotion-failure').text()).toContain('http://fail');
  expect(
    wrapper
      .find('.promotion-failure')
      .find('a')
      .exists(),
  ).toBe(true);
});

test('should render environment links for Page component', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    type: ComponentType.Page,
    useCache: false,
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(
    wrapper
      .find('.envLink')
      .at(0)
      .prop('href'),
  ).toBe('https://morph.int.api.bbci.co.uk/data/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(1)
      .prop('href'),
  ).toBe('https://morph.test.api.bbci.co.uk/data/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(2)
      .prop('href'),
  ).toBe('https://morph.api.bbci.co.uk/data/bbc-morph-test');
});

test('should render environment links for View component', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    type: ComponentType.View,
    useCache: false,
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(
    wrapper
      .find('.envLink')
      .at(0)
      .prop('href'),
  ).toBe('https://morph.int.api.bbci.co.uk/page/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(1)
      .prop('href'),
  ).toBe('https://morph.test.api.bbci.co.uk/page/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(2)
      .prop('href'),
  ).toBe('https://morph.api.bbci.co.uk/page/bbc-morph-test');
});

test('should render environment links for Data component', () => {
  const component: IComponentData = {
    displayName: 'test',
    favorite: false,
    name: 'bbc-morph-test',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    type: ComponentType.Data,
    useCache: false,
  };

  const wrapper = mount(<ComponentVersions theme={{}} component={component} />);

  expect(
    wrapper
      .find('.envLink')
      .at(0)
      .prop('href'),
  ).toBe('https://morph.int.api.bbci.co.uk/data/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(1)
      .prop('href'),
  ).toBe('https://morph.test.api.bbci.co.uk/data/bbc-morph-test');

  expect(
    wrapper
      .find('.envLink')
      .at(2)
      .prop('href'),
  ).toBe('https://morph.api.bbci.co.uk/data/bbc-morph-test');
});
