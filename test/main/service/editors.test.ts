import createMockService from '../mocks/service';

test('editors list is empty when code is not installed', async () => {
  const { service } = await createMockService({
    systemModifier: (builder) => {
      builder.withProcessOutputs('which code', '/test/components', [], ['code not found']);
    },
  });
  const data = await service.getComponentsData();
  const summaryData = await service.getComponentsSummaryData();

  expect(data.editors).toEqual([]);
  expect(summaryData.editors).toEqual([]);
});

test('editors includes code when installed', async () => {
  const { service } = await createMockService({
    systemModifier: (builder) => {
      builder.withProcessOutputs('which code', '/test/components', ['/usr/local/bin/code'], []);
    },
  });
  const data = await service.getComponentsData();
  const summaryData = await service.getComponentsSummaryData();

  expect(data.editors).toEqual(['code']);
  expect(summaryData.editors).toEqual(['code']);
});
