import createMockService from '../mocks/service';

test('can get theme from service', async () => {
  const configFileContents = {
    themeOverrides: {
      primaryBackgroundColour: 'red',
      primaryTextColour: 'blue',
    },
  };
  const { service } = await createMockService({
    systemModifier: (builder) => {
      builder.withReadFile('/mdc-config.json', JSON.stringify(configFileContents));
    },
  });
  const data = await service.getComponentsData();
  const summaryData = await service.getComponentsSummaryData();

  expect(data.theme).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'red',
      primaryTextColour: 'blue',
    }),
  );

  expect(summaryData.theme).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'red',
      primaryTextColour: 'blue',
    }),
  );
});
