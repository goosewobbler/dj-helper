import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import renderApp from './mocks/app';
import mockFetch from './mocks/fetch';

const render = (versions: { int: string; live: string; local: string; test: string }) => {
  mockFetch();
  const {wrapper} = renderApp([
    {
      displayName: 'bar',
      favorite: false,
      name: 'bbc-morph-bar',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
      versions,
    },
    {
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
      versions,
    },
  ]);

  const componentListItem = wrapper.find(ComponentListItem).at(1);
  componentListItem.simulate('click');

  const fetch = mockFetch();
  return { wrapper, fetch };
};

test('when I click Bump.', () => {
  const { wrapper } = render({
    int: '1.2.3',
    live: '1.0.0',
    local: '1.2.4',
    test: '1.0.0',
  });

  const fetch = mockFetch({
    'http://localhost:3333/api/component/bbc-morph-foo/bump/patch': null,
  });

  const bump = wrapper.find('.bump-button').at(0);
  bump.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/bump/patch']);
});

test('when I click promote to TEST.', () => {
  const { wrapper, fetch } = render({
    int: '1.2.3',
    live: '1.0.0',
    local: '1.2.4',
    test: '1.0.0',
  });
  const promoteButton = wrapper.find('.promote-button').at(0);
  promoteButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/promote/test']);
});

test('when I click promote to LIVE.', () => {
  const { wrapper, fetch } = render({
    int: '1.1.0',
    live: '1.0.0',
    local: '1.2.4',
    test: '1.1.0',
  });
  const promoteButton = wrapper.find('.promote-button').at(0);
  promoteButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/promote/live']);
});

test('when I click promote to TEST when no version on TEST.', () => {
  const { wrapper, fetch } = render({
    int: '1.2.3',
    live: '',
    local: '1.2.4',
    test: '',
  });
  const promoteButton = wrapper.find('.promote-button').at(0);
  promoteButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/promote/test']);
});

test('when I click promote to LIVE when no version on LIVE.', () => {
  const { wrapper, fetch } = render({
    int: '1.1.0',
    live: '',
    local: '1.2.4',
    test: '1.1.0',
  });
  const promoteButton = wrapper.find('.promote-button').at(0);
  promoteButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/promote/live']);
});
