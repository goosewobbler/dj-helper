import ComponentListItem from '../../src/client/components/ComponentListItem';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

test('history is updated when selecting a component', () => {
  (window as any).historyEnabled = true;
  window.history.pushState = jest.fn();

  mockFetch();
  const { wrapper } = render();

  wrapper
    .find(ComponentListItem)
    .at(2)
    .simulate('click');

  expect(window.history.pushState).toHaveBeenCalledTimes(1);
  expect(window.history.pushState).toHaveBeenCalledWith(
    { name: 'bbc-morph-sport-search' },
    null,
    '/component/bbc-morph-sport-search',
  );
});

test('history is not updated when selecting a component when history is disabled', () => {
  (window as any).historyEnabled = false;
  window.history.pushState = jest.fn();

  mockFetch();
  const { wrapper } = render();

  wrapper
    .find(ComponentListItem)
    .at(2)
    .simulate('click');

  expect(window.history.pushState).toHaveBeenCalledTimes(0);
});
