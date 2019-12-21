import toJson from 'enzyme-to-json';
import ComponentListFilter from '../../src/client/components/ComponentListFilter';
import ComponentListItem from '../../src/client/components/ComponentListItem';
import ComponentState from '../../src/types/ComponentState';
import IComponentData from '../../src/types/IComponentData';
import render from './mocks/app';

test('the filter has the correct style with no input.', () => {
  const { wrapper } = render();
  const filter = wrapper.find(ComponentListFilter);

  expect(toJson(filter)).toMatchSnapshot();
});

describe('when I focus and type in the filter.', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = render().wrapper;

    const input = wrapper.find(ComponentListFilter).find('input');
    input.simulate('focus');
    input.simulate('keyDown');
    input.simulate('change', { target: { value: 'sport' } });
  });

  test('the filter has the correct style with input.', () => {
    const filter = wrapper.find(ComponentListFilter);

    expect(toJson(filter)).toMatchSnapshot();
  });

  test('the filter has the correct style when not focussed.', () => {
    const filter = wrapper.find(ComponentListFilter);
    const input = wrapper.find(ComponentListFilter).find('input');
    input.simulate('blur');

    expect(toJson(filter)).toMatchSnapshot();
  });

  test('only the matching results are displayed.', () => {
    const results = wrapper.find('.component-name-label').map((item: any) => item.text());

    expect(results).toEqual(['sport-search']);
  });

  test('pressing the clear button removes the filter.', () => {
    const clearButton = wrapper.find(ComponentListFilter).find('button');

    clearButton.simulate('click');

    const results = wrapper
      .find(ComponentListItem)
      .find('.component-name-label')
      .map((item: any) => item.text());

    expect(results).toEqual(['football-scores-view', 'ideas-page', 'sport-search', 'xyz-node-10']);
  });

  test('pressing the escape key removes the filter.', () => {
    const input = wrapper.find(ComponentListFilter).find('input');

    input.simulate('keyDown', { keyCode: 27 });

    const results = wrapper
      .find(ComponentListItem)
      .find('.component-name-label')
      .map((item: any) => item.text());

    expect(results).toEqual(['football-scores-view', 'ideas-page', 'sport-search', 'xyz-node-10']);
  });
});

test('the number of search results is capped.', () => {
  const components: IComponentData[] = [];
  for (let i = 0; i < 60; i++) {
    components[i] = {
      displayName: 'abc',
      favorite: false,
      name: 'bbc-morph-abc',
      rendererType: '0.12',
      state: ComponentState.Stopped,
      useCache: false,
      versions: {
        int: '',
        live: '',
        local: '',
        test: '',
      },
    };
  }

  const { wrapper } = render(components);
  const input = wrapper.find(ComponentListFilter).find('input');
  input.simulate('change', { target: { value: 'ab' } });
});
