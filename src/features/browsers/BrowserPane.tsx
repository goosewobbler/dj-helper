import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearAllTracks, selectTracksByBrowserId } from '../tracks/tracksSlice';
import { MetaPanel } from './MetaPanel';
import { Browser } from '../../common/types';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  const dispatch = useDispatch();
  const { isDev } = window.api;
  const tracks = useSelector(selectTracksByBrowserId(browser.id));
  return (
    <div>
      {isDev && (
        <button type="button" onClick={() => dispatch(clearAllTracks())}>
          Clear Tracks
        </button>
      )}
      <MetaPanel tracks={tracks} />
      <div className="browserPanel" />
    </div>
  );
}
