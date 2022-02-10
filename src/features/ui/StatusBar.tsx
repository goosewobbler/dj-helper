import React, { ReactElement } from 'react';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { TrackPreviewEmbedSize } from '../../common/types';
import { NextTrackIcon } from '../../icons/NextTrackIcon';
import { PreviousTrackIcon } from '../../icons/PreviousTrackIcon';
import {
  loadAndPlayNextTrack,
  loadAndPlayPreviousTrack,
  selectNextTrack,
  selectPreviousTrack,
} from '../embed/embedSlice';
import { SettingsPanel } from './SettingsPanel';
import { selectStatusText, selectTrackPreviewEmbedSize } from './uiSlice';

export function StatusBar(): ReactElement {
  const dispatch = useAppDispatch();
  const trackPreviewEmbedSize = useAppSelector(selectTrackPreviewEmbedSize);
  const statusText = useAppSelector(selectStatusText);
  const nextTrackId = useAppSelector(selectNextTrack);
  const previousTrackId = useAppSelector(selectPreviousTrack);
  const isSmallEmbed = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small;
  const heightClassName = isSmallEmbed ? 'h-16' : 'h-36';
  const trackSkipIconMarginClassName = isSmallEmbed ? '' : 'my-10';
  const nextTrackBtnDisabled = !nextTrackId;
  const prevTrackBtnDisabled = !previousTrackId;

  return (
    <div className={`fixed bottom-0 left-0 block w-full ${heightClassName} bg-indigo-100 z-50 status-panel`}>
      <div className="status-text">{statusText}</div>
      <div className="absolute">
        <button
          type="button"
          className="w-12 h-full"
          onClick={() => {
            dispatch(loadAndPlayPreviousTrack());
          }}
          disabled={prevTrackBtnDisabled}
        >
          <PreviousTrackIcon className={`w-12 h-16 ${trackSkipIconMarginClassName}`} disabled={prevTrackBtnDisabled} />
        </button>
        <div className="inline-block h-16 embed-placeholder" />
        <button
          type="button"
          className="w-12 h-full"
          onClick={() => {
            dispatch(loadAndPlayNextTrack());
          }}
          disabled={nextTrackBtnDisabled}
        >
          <NextTrackIcon className={`w-12 h-16 ${trackSkipIconMarginClassName}`} disabled={nextTrackBtnDisabled} />
        </button>
      </div>

      <SettingsPanel />
    </div>
  );
}
