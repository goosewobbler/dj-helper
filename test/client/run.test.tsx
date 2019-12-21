import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

test('can start a stopped component', () => {
  const fetch = mockFetch();

  const components: IComponentData[] = [
    {
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
    },
  ];

  const { wrapper } = render(components);
  wrapper.find('.start-button').simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/start']);
});

test('can stop a running component', () => {
  const fetch = mockFetch();

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

  const { wrapper } = render(components);
  wrapper.find('.stop-button').simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/stop']);
});
