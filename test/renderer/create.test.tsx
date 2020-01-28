import render from './mocks/app';
import mockFetch from './mocks/fetch';

test('create a new view with css component', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/viewcss': '',
  });

  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  const type = wrapper
    .find('.create-type-select option')
    .at(0)
    .prop('value');

  wrapper.find('.create-type-select').simulate('change', { target: { value: type } });
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View with CSS component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-view-css","description":"My View with CSS component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/viewcss',
    },
  ]);
});

test('create a new view component', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/view': '',
  });
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  const type = wrapper
    .find('.create-type-select option')
    .at(1)
    .prop('value');

  wrapper.find('.create-type-select').simulate('change', { target: { value: type } });
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-view","description":"My View component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/view',
    },
  ]);
});

test('create a new data component', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/data': '',
  });
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  const type = wrapper
    .find('.create-type-select option')
    .at(2)
    .prop('value');

  wrapper.find('.create-type-select').simulate('change', { target: { value: type } });
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-data' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My data component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-data","description":"My data component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/data',
    },
  ]);
});

test('creates a view with css component by default', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/viewcss': '',
  });
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View with CSS component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-view-css","description":"My View with CSS component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/viewcss',
    },
  ]);
});

test('cannot submit without name', () => {
  const fetch = mockFetch();
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View with CSS component.' } });
  wrapper.find('.create-create-button').simulate('click');

  expect(fetch.getCallsWithOptions()).toEqual([]);
});

test('cannot submit without description', () => {
  const fetch = mockFetch();
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');
  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([]);
});

test('can close the dialog by pressing the close button', () => {
  const { wrapper } = render();
  wrapper.find('.create-button').simulate('click');
  wrapper.find('.dialog-close-button').simulate('click');

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can close the dialog by pressing escape in the name input', () => {
  const { wrapper } = render();
  wrapper.find('.create-button').simulate('click');
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 123 });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 27 });

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can close the dialog by pressing escape in the description input', () => {
  const { wrapper } = render();
  wrapper.find('.create-button').simulate('click');
  wrapper.find('.create-description-input').simulate('keyDown', { keyCode: 27 });

  expect(wrapper.find('.dialog').exists()).toBe(false);
});

test('can submit by pressing enter in the name input', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/viewcss': '',
  });
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View with CSS component.' } });
  wrapper.find('.create-name-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-view-css","description":"My View with CSS component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/viewcss',
    },
  ]);
});

test('can submit by pressing enter in the description input', () => {
  const fetch = mockFetch({
    'http://localhost:3333/api/component/create/viewcss': '',
  });
  const { wrapper } = render();

  wrapper.find('.create-button').simulate('click');

  wrapper.find('.create-name-input').simulate('change', { target: { value: 'new-view-css' } });
  wrapper.find('.create-description-input').simulate('change', { target: { value: 'My View with CSS component.' } });
  wrapper.find('.create-description-input').simulate('keyDown', { keyCode: 13 });

  expect(fetch.getCallsWithOptions()).toEqual([
    {
      options: {
        body: '{"name":"new-view-css","description":"My View with CSS component."}',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      },
      url: 'http://localhost:3333/api/component/create/viewcss',
    },
  ]);
});
