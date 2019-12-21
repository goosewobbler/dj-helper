import createMockService from '../mocks/service';

test('can set favorite', async () => {
  const { service, state } = await createMockService();

  expect(state.retrieve('favorite.bbc-morph-foo')).toBeNull();
  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        favorite: false,
        name: 'bbc-morph-foo',
      }),
    ]),
  );

  await service.setFavorite('bbc-morph-foo', true);

  expect(state.retrieve('favorite.bbc-morph-foo')).toBe(true);
  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        favorite: true,
        name: 'bbc-morph-foo',
      }),
    ]),
  );

  await service.setFavorite('bbc-morph-foo', false);

  expect(state.retrieve('favorite.bbc-morph-foo')).toBeNull();
  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        favorite: false,
        name: 'bbc-morph-foo',
      }),
    ]),
  );
});

test('favorite is retrieved from state', async () => {
  const { service, state } = await createMockService();

  await state.store('favorite.bbc-morph-foo', true);

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        favorite: true,
        name: 'bbc-morph-foo',
      }),
    ]),
  );
});
