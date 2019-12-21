import createMockService from '../mocks/service';

test('can get a list of components', async () => {
  const { service } = await createMockService();
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      name: 'bbc-morph-foo',
    }),
    expect.objectContaining({
      name: 'bbc-morph-bar',
    }),
    expect.objectContaining({
      name: 'bbc-morph-baz',
    }),
  ]);
});
