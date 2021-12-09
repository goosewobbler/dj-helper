import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { TrackPreviewEmbedSize } from '../../common/types';
import { SettingsPanel } from './SettingsPanel';
import { selectStatusText, selectTrackPreviewEmbedSize } from './uiSlice';

export function StatusBar(): ReactElement {
  const trackPreviewEmbedSize = useSelector(selectTrackPreviewEmbedSize());
  const heightClassName = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small ? 'h-16' : 'h-36';
  const statusText = useSelector(selectStatusText());
  return (
    <div className={`fixed bottom-0 left-0 block w-full ${heightClassName} bg-indigo-100 z-50 status-panel`}>
      <div className="status-text">{statusText}</div>
      <SettingsPanel />
    </div>
  );
}
