import { createSlice } from '@reduxjs/toolkit';
import { AppState, Settings, TrackPreviewEmbedSize } from '../../common/types';

const initialState = {
  darkModeEnabled: false,
  autoplayEnabled: true,
  trackPreviewEmbedSize: TrackPreviewEmbedSize.Small,
} as Settings;

export const slice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setSetting: (
      state,
      { payload: { settingKey, settingValue } }: { payload: { settingKey: string; settingValue: boolean | string } },
    ) => ({
      ...state,
      [settingKey]: settingValue,
    }),
  },
});

export const { setSetting } = slice.actions;

export const getSettingValue =
  ({ settingKey }: { settingKey: string }) =>
  ({ settings }: AppState): string =>
    settings[settingKey as keyof Settings] as string;

export const settingsReducer = slice.reducer;
