import { receiveEditors } from '../../src/client/actions/components';
import ComponentListItem from '../../src/client/components/ComponentListItem';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

let fetch: { getCalls(): string[] };
let wrapper: any;
let store: any;

beforeEach(() => {
  mockFetch();
  const rendered = render();
  wrapper = rendered.wrapper;
  store = rendered.store;

  const componentListItem = wrapper.find(ComponentListItem).at(2);
  componentListItem.simulate('click');

  fetch = mockFetch();
});

test('can reinstall component.', () => {
  const installButton = wrapper.find('.install-button').at(0);
  installButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-sport-search/install']);

  expect(wrapper.find('.install-button').exists()).toBe(false);
});

test('can build component.', () => {
  const installButton = wrapper.find('.build-button').at(0);
  installButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-sport-search/build']);

  expect(wrapper.find('.build-button').exists()).toBe(false);
});

test('does not show open in code button when no editors are installed', () => {
  const codeButton = wrapper.find('.vs-code-button');

  expect(codeButton.exists()).toBe(false);
});

test('show open in code button when code editor is installed', () => {
  store.dispatch(receiveEditors(['code']));
  const codeButton = wrapper.find('.vs-code-button');

  expect(codeButton.exists()).toBe(true);
});

test('can open in code.', () => {
  store.dispatch(receiveEditors(['code']));
  const codeButton = wrapper.find('.vs-code-button');
  codeButton.simulate('click');

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/component/bbc-morph-sport-search/edit']);
});
