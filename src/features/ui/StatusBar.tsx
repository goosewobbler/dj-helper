import React, { ReactElement } from 'react';

import { TrackPreviewEmbedSize } from '../../common/types.js';
import { NextTrackIcon } from '../../icons/NextTrackIcon.js';
import { PreviousTrackIcon } from '../../icons/PreviousTrackIcon.js';
import {
  loadAndPlayNextTrack,
  loadAndPlayPreviousTrack,
  selectNextTrack,
  selectPreviousTrack,
} from '../embed/index.js';
import { SettingsPanel } from './SettingsPanel.js';
import { selectStatusText, selectTrackPreviewEmbedSize } from './index.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { useStore } from '../../renderer/hooks/useStore.js';

export function StatusBar(): ReactElement {
  const dispatch = useDispatch();
  const isSmallEmbed = useStore(selectTrackPreviewEmbedSize(TrackPreviewEmbedSize.Small));
  const statusText = useStore(selectStatusText);
  const nextTrackId = useStore(selectNextTrack);
  const previousTrackId = useStore(selectPreviousTrack);
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
