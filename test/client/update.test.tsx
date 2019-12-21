import { updateAvailable, updated, updating } from '../../src/client/actions/components';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

test('should not render the update bar without an available update', () => {
  const { wrapper } = render([]);

  const updateBar = wrapper.find('.update-bar');
  expect(updateBar.exists()).toBe(false);
});

test('should render the update bar when an update is available', () => {
  const { wrapper, store } = render([]);

  store.dispatch(updateAvailable());

  const updateBar = wrapper.find('.update-bar');
  const expectedMessage = "There is an update available for the Morph Developer Console. See what's new. 👀Update";
  expect(updateBar.exists()).toBe(true);
  expect(updateBar.text()).toBe(expectedMessage);
});

test('should render the updating bar when updating', () => {
  const { wrapper, store } = render([]);

  store.dispatch(updating());
  store.dispatch(updateAvailable());

  const updateBar = wrapper.find('.update-bar');
  const expectedMessage = 'Updating  😟';
  expect(updateBar.exists()).toBe(true);
  expect(updateBar.text()).toBe(expectedMessage);
});

test('should render the updated bar when updated', () => {
  const { wrapper, store } = render([]);

  store.dispatch(updated());
  store.dispatch(updateAvailable());

  const updateBar = wrapper.find('.update-bar');
  const expectedMessage = 'Morph Developer Console updated sucessfully  🎉  Restart to apply updates.';
  expect(updateBar.exists()).toBe(true);
  expect(updateBar.text()).toBe(expectedMessage);
});

test('clicking on the update button should start the update', () => {
  const fetch = mockFetch();
  const { wrapper, store } = render([]);

  store.dispatch(updateAvailable());

  const updateBar = wrapper.find('.update-bar');
  const updateButton = wrapper.find('.update-button');
  updateButton.simulate('click');

  const expectedMessage = 'Updating  😟';
  expect(updateBar.exists()).toBe(true);
  expect(updateBar.text()).toBe(expectedMessage);

  expect(fetch.getCalls()).toEqual(['http://localhost:3333/api/update']);
});
