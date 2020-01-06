import { Theme, Store } from '../../common/types';

const DEFAULT_VALUES: Theme = {
  buildingColour: 'rgb(203, 117, 255)',
  font: 'Roboto',
  headerColour: 'rgba(0, 0, 0, 0.05)',
  highlightColour: 'rgb(106, 196, 230)',
  installingColour: 'rgb(255, 90, 90)',
  launchColour: 'rgb(36, 145, 200)',
  linkedColour: 'rgb(201, 255, 201)',
  loadingColour: 'rgb(255, 165, 0)',
  negativeColour: 'rgb(255, 69, 69)',
  neutralColour: 'rgb(170, 170, 170)',
  positiveColour: 'rgb(89, 187, 93)',
  primaryBackgroundColour: 'rgb(238, 238, 238)',
  primaryTextColour: 'rgb(0, 0, 0)',
  runningColour: 'rgb(186, 236, 255)',
  secondaryBackgroundColour: 'rgb(255, 255, 255)',
  secondaryTextColour: 'rgb(255, 255, 255)',
  selectedItemBorderColour: 'rgba(0, 0, 0, 0.7)',
  startingColour: 'rgb(255, 165, 0)',
  tertiaryBackgroundColour: 'rgb(0, 0, 0)',
  tertiaryTextColour: 'rgb(255, 255, 255)',
};

const DARK_THEME_PRESET: Theme = {
  highlightColour: 'rgb(40, 255, 138)',
  installingColour: 'rgb(255, 51, 96)',
  launchColour: 'rgb(255, 255, 255)',
  linkedColour: 'rgb(17, 148, 77)',
  loadingColour: 'rgb(255, 255, 255)',
  negativeColour: 'rgb(255, 51, 96)',
  neutralColour: 'rgb(255, 255, 255)',
  positiveColour: 'rgb(40, 255, 138)',
  primaryBackgroundColour: 'rgb(25, 25, 25)',
  primaryTextColour: 'rgb(255, 255, 255)',
  runningColour: 'rgb(17, 148, 77)',
  secondaryBackgroundColour: 'rgb(50, 50, 50)',
  secondaryTextColour: 'rgb(0, 0, 0)',
  selectedItemBorderColour: 'rgb(40, 255, 138)',
  tertiaryBackgroundColour: 'rgb(255, 255, 255)',
  tertiaryTextColour: 'rgb(0, 0, 0)',
};

const THEME_PRESETS: { [Key: string]: Theme } = {
  dark: DARK_THEME_PRESET,
};

const createTheme = (config: Store): { getValues(): Theme } => {
  const themePreset = config.get('themePreset') || '';
  const themePresetOverrides = THEME_PRESETS[themePreset as string] || {};
  const themeOverrides = config.get('themeOverrides') || {};
  const values = { ...DEFAULT_VALUES, ...themePresetOverrides, ...themeOverrides };

  return {
    getValues: (): Theme => {
      return values;
    },
  };
};

export default createTheme;
