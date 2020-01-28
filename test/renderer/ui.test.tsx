import toJson from 'enzyme-to-json';
import { receiveTheme } from '../../src/client/actions/components';
import render from './mocks/app';

test('it should render a title.', () => {
  const { wrapper, store } = render();

  const theme: any = {
    font: 'Comic Sans MS',
    primaryFontColour: 'orange',
  };

  store.dispatch(receiveTheme(theme));

  const title = wrapper.find('h1');

  expect(title.text()).toBe('Morph Developer Console');
  expect(toJson(title)).toMatchSnapshot();
});
