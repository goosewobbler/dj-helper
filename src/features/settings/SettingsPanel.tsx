import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { clearAllBrowsers } from '../browsers/browsersSlice';
import { clearAllTracks } from '../tracks/tracksSlice';

export function SettingsPanel(): ReactElement {
  const { isDev } = window.api;
  const dispatch = useDispatch();

  return (
    <div>
      {isDev && (
        <button
          type="button"
          onClick={() => {
            dispatch(clearAllTracks());
            dispatch(clearAllBrowsers());
          }}
        >
          Clear Data
        </button>
      )}
    </div>
  );
}
