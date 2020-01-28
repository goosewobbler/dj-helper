import Config from '../../../src/server/app/Config';
import Theme from '../../../src/server/app/Theme';
import createMockSystem from '../mocks/system';

const createConfig = (configFileContents: any) => {
  const system = createMockSystem()
    .withReadFile('/c/mdcc.json', JSON.stringify(configFileContents))
    .build();

  return Config('/c/mdcc.json', system);
};

test('can create a theme with default values', async () => {
  const theme = await Theme(await createConfig({}));

  expect(theme.getValues()).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'rgb(238, 238, 238)',
      primaryTextColour: 'rgb(0, 0, 0)',
    }),
  );
});

test('can override theme values in config', async () => {
  const theme = await Theme(
    await createConfig({
      themeOverrides: {
        primaryBackgroundColour: 'red',
        primaryTextColour: 'blue',
      },
    }),
  );

  expect(theme.getValues()).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'red',
      primaryTextColour: 'blue',
    }),
  );
});

test('can set a theme preset', async () => {
  const theme = await Theme(
    await createConfig({
      themePreset: 'dark',
    }),
  );

  expect(theme.getValues()).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'rgb(25, 25, 25)',
      primaryTextColour: 'rgb(255, 255, 255)',
    }),
  );
});

test('can override theme preset values in config', async () => {
  const theme = await Theme(
    await createConfig({
      themeOverrides: {
        primaryBackgroundColour: 'red',
      },
      themePreset: 'dark',
    }),
  );

  expect(theme.getValues()).toEqual(
    expect.objectContaining({
      font: 'Roboto',
      primaryBackgroundColour: 'red',
      primaryTextColour: 'rgb(255, 255, 255)',
    }),
  );
});
