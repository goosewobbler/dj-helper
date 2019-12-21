import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import renderApp from './mocks/app';
import mockFetch from './mocks/fetch';

const render = (rendererType: string, state: ComponentState) => {
  const components: IComponentData[] = [
    {
      displayName: 'foo',
      favorite: false,
      name: 'bbc-morph-foo',
      rendererType,
      state,
      useCache: false,
    },
  ];

  mockFetch();
  const { wrapper } = renderApp(components);
  wrapper
    .find(ComponentListItem)
    .at(0)
    .simulate('click');

  return { wrapper };
};

test('the node version is displayed when version is 0.12', () => {
  const { wrapper } = render('0.12', ComponentState.Stopped);

  const rendererLabel = wrapper.find('.renderer-label').text();

  expect(rendererLabel).toBe('Node version: 0.12');
});

test('the node version is displayed when version is 10', () => {
  const { wrapper } = render('10', ComponentState.Stopped);

  const rendererLabel = wrapper.find('.renderer-label').text();

  expect(rendererLabel).toBe('Node version: 10');
});
