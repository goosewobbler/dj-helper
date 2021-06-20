import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import renderApp from './mocks/app';
import mockFetch from './mocks/fetch';

const render = (useCache: boolean, state: ComponentState) => {
  const components: IComponentData[] = [
    {
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType: '0.12',
      state,
      useCache,
    },
  ];

  mockFetch();
  const { wrapper } = renderApp(components);
  wrapper.find(ComponentListItem).at(0).simulate('click');

  return { wrapper };
};

test('can enable cache for a component', () => {
  const { wrapper } = render(false, ComponentState.Stopped);
  const fetch = mockFetch();
  wrapper.find('.use-cache-button').simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/cache/true']);
});

test('can disable cache for a component', () => {
  const { wrapper } = render(true, ComponentState.Stopped);
  const fetch = mockFetch();
  wrapper.find('.no-use-cache-button').simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-foo/cache/false']);
});

test('cache button is only rendered when stopped or running', () => {
  const availableStates = [ComponentState.Running, ComponentState.Stopped];
  const unavailableStates = [
    ComponentState.Building,
    ComponentState.Installing,
    ComponentState.Linking,
    ComponentState.Starting,
  ];

  availableStates.forEach((state) => {
    const { wrapper } = render(false, state);
    expect(wrapper.find('.use-cache-button').exists()).toBe(true);
  });

  unavailableStates.forEach((state) => {
    const { wrapper } = render(false, state);
    expect(wrapper.find('.use-cache-button').exists()).toBe(false);
  });
});
