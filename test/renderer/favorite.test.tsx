import { ReactWrapper } from 'enzyme';
import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

const expectItemsToBe = (items: ReactWrapper<any, any>, expectations: Array<{ name: string; favorited: boolean }>) => {
  expectations.forEach((expectation, index) => {
    expect(items.at(index).find('.component-name-label').text()).toBe(expectation.name);

    expect(items.at(index).find('.favorite-button').exists()).toBe(!expectation.favorited);

    expect(items.at(index).find('.unfavorite-button').exists()).toBe(expectation.favorited);
  });
};

test('can favorite and unfavorite a component', () => {
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
    {
      displayName: 'bar',
      favorite: false,
      name: 'bbc-morph-bar',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
    },
    {
      displayName: 'baz',
      favorite: false,
      name: 'bbc-morph-baz',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
    },
  ];

  const { wrapper } = render(components);
  const items = wrapper.find(ComponentListItem);

  expectItemsToBe(items, [
    { name: 'bar', favorited: false },
    { name: 'baz', favorited: false },
    { name: 'foo', favorited: false },
  ]);

  items.at(2).find('.favorite-button').simulate('click');

  expectItemsToBe(items, [
    { name: 'foo', favorited: true },
    { name: 'bar', favorited: false },
    { name: 'baz', favorited: false },
  ]);

  items.at(2).find('.favorite-button').simulate('click');

  expectItemsToBe(items, [
    { name: 'baz', favorited: true },
    { name: 'foo', favorited: true },
    { name: 'bar', favorited: false },
  ]);

  items.at(1).find('.unfavorite-button').simulate('click');

  expectItemsToBe(items, [
    { name: 'baz', favorited: true },
    { name: 'bar', favorited: false },
    { name: 'foo', favorited: false },
  ]);

  expect(fetch.getCalls()).toEqual([
    'http://localhost:3333/api/component/bbc-morph-foo/favorite/true',
    'http://localhost:3333/api/component/bbc-morph-baz/favorite/true',
    'http://localhost:3333/api/component/bbc-morph-foo/favorite/false',
  ]);
});
