import ComponentListItem from '../../src/client/components/ComponentListItem';
import render from './mocks/app';
import mockFetch from './mocks/fetch';

test('clone a component', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  const fetch = mockFetch({
    'http://localhost:3333/api/component/bbc-morph-sport-search/clone': '',
  });

  wrapper.find('.clone-button').simulate('click');

  wrapper.find('.create-name-input').simulate('change', { target: { value: 'cloned-sport-search' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My cloned search.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"cloned-sport-search","description":"My cloned search."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/bbc-morph-sport-search/clone',
    },
  ]);
});

test('cannot submit without name', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  const fetch = mockFetch();

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My cloned component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([]);
});

test('cannot submit without description', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  const fetch = mockFetch();

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([]);
});

test('can close the dialog by pressing the close button', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.dialog-close-button').simulate('click');

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can close the dialog by pressing escape in the name input', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 123 });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 27 });

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can close the dialog by pressing escape in the description input', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-description-input').simulate('keyDown', { keyCode: 27 });

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can submit by pressing enter in the name input', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  const fetch = mockFetch({
    'http://localhost:3333/api/component/bbc-morph-sport-search/clone': '',
  });

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'cloned' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My cloned component.' } });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"cloned","description":"My cloned component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/bbc-morph-sport-search/clone',
    },
  ]);
});

test('can submit by pressing enter in the description input', () => {
  const { wrapper } = render();
  mockFetch();

  wrapper.find(ComponentListItem).at(2).simulate('click');

  const fetch = mockFetch({
    'http://localhost:3333/api/component/bbc-morph-sport-search/clone': '',
  });

  wrapper.find('.clone-button').simulate('click');
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'cloned' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My cloned component.' } });
  wrapper.find('.create-description-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"cloned","description":"My cloned component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/bbc-morph-sport-search/clone',
    },
  ]);
});
