import React, { ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { clearAllTracks } from '../tracks/tracksSlice';
import { MetaPanel } from './MetaPanel';
import { Browser } from '../../common/types';
import { clearAllBrowsers } from './browsersSlice';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  const dispatch = useDispatch();
  const { isDev } = window.api;
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
      <MetaPanel browser={browser} />
      <div className="browserPanel" />
    </div>
  );
}
