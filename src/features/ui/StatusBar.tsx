import React, { ReactElement } from 'react';
import { useAppSelector } from '../../common/hooks';
import { TrackPreviewEmbedSize } from '../../common/types';
import { SettingsPanel } from './SettingsPanel';
import { selectStatusText, selectTrackPreviewEmbedSize } from './uiSlice';

export function StatusBar(): ReactElement {
  const trackPreviewEmbedSize = useAppSelector(selectTrackPreviewEmbedSize);
  const statusText = useAppSelector(selectStatusText);
  const heightClassName = trackPreviewEmbedSize === TrackPreviewEmbedSize.Small ? 'h-16' : 'h-36';
  return (
    <div className={`fixed bottom-0 left-0 block w-full ${heightClassName} bg-indigo-100 z-50 status-panel`}>
      <div className="status-text">{statusText}</div>
      <SettingsPanel />
    </div>
  );
}
