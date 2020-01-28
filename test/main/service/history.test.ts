import createMockService from '../mocks/service';

test('can read history from state', async () => {
  const { service, state } = await createMockService();

  await state.store('history.bbc-morph-bar', ['/a/1/b/2', '/hello/world', '/status', '']);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        history: ['/a/1/b/2', '/hello/world', '/status', ''],
        name: 'bbc-morph-bar',
      }),
      expect.objectContaining({
        history: [],
        name: 'bbc-morph-baz',
      }),
    ]),
  );
});

test('can store history on request', async () => {
  const { service } = await createMockService();

  await service.start('bbc-morph-bar');
  await service.request('bbc-morph-bar', { a: '1' }, true);
  await service.request('bbc-morph-bar', { b: '2' }, true);
  await service.request('bbc-morph-bar', {}, true);
  await service.request('bbc-morph-bar', { a: '1', b: '2' }, true);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        history: ['/a/1/b/2', '', '/b/2', '/a/1'],
        name: 'bbc-morph-bar',
      }),
    ]),
  );
});

test('only last 10 history entries are stored', async () => {
  const { service } = await createMockService();

  await service.start('bbc-morph-bar');
  await service.request('bbc-morph-bar', { a: '0' }, true);
  await service.request('bbc-morph-bar', { a: '1' }, true);
  await service.request('bbc-morph-bar', { a: '2' }, true);
  await service.request('bbc-morph-bar', { a: '3' }, true);
  await service.request('bbc-morph-bar', { a: '4' }, true);
  await service.request('bbc-morph-bar', { a: '5' }, true);
  await service.request('bbc-morph-bar', { a: '6' }, true);
  await service.request('bbc-morph-bar', { a: '7' }, true);
  await service.request('bbc-morph-bar', { a: '8' }, true);
  await service.request('bbc-morph-bar', { a: '9' }, true);
  await service.request('bbc-morph-bar', { a: '10' }, true);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        history: ['/a/10', '/a/9', '/a/8', '/a/7', '/a/6', '/a/5', '/a/4', '/a/3', '/a/2', '/a/1'],
        name: 'bbc-morph-bar',
      }),
    ]),
  );
});

test('requests already in history are moved to the top not duplicated', async () => {
  const { service } = await createMockService();

  await service.start('bbc-morph-bar');
  await service.request('bbc-morph-bar', { a: '0' }, true);
  await service.request('bbc-morph-bar', { a: '1' }, true);
  await service.request('bbc-morph-bar', { a: '2' }, true);
  await service.request('bbc-morph-bar', { a: '1' }, true);
  await service.request('bbc-morph-bar', { a: '0' }, true);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        history: ['/a/0', '/a/1', '/a/2'],
        name: 'bbc-morph-bar',
      }),
    ]),
  );
});

test('component is updated with new history', async () => {
  const { service, onComponentUpdate } = await createMockService();

  await service.start('bbc-morph-bar');
  await service.request('bbc-morph-bar', { a: '1' }, true);
  await service.request('bbc-morph-bar', { b: '2' }, true);

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/a/1'],
      name: 'bbc-morph-bar',
    }),
  );

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/b/2', '/a/1'],
      name: 'bbc-morph-bar',
    }),
  );
});

test('component is not updated on request without history', async () => {
  const { service, onComponentUpdate } = await createMockService();

  await service.start('bbc-morph-bar');
  await service.request('bbc-morph-bar', { a: '1' }, false);

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
});

test('path prop is stored for page history', async () => {
  const { service } = await createMockService();

  await service.start('bbc-morph-foo');
  await service.request('bbc-morph-foo', { path: '/a/1/b/2' }, true);
  await service.request('bbc-morph-foo', { path: '/hello' }, true);
  await service.request('bbc-morph-foo', {}, true);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        history: ['', '/hello', '/a/1/b/2'],
        name: 'bbc-morph-foo',
      }),
    ]),
  );
});
