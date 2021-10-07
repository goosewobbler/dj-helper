import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { getSettingValue } from '../settings/settingsSlice';

export function StatusBar(): ReactElement {
  const trackPreviewEmbedSize = useSelector(getSettingValue({ settingKey: 'trackPreviewEmbedSize' }));
  const heightClassName = trackPreviewEmbedSize === 'small' ? 'h-16' : 'h-24';
  const statusText = '';
  return (
    <div className={`fixed bottom-0 left-0 block w-full ${heightClassName} bg-indigo-100 status-panel`}>
      <div className="status-text">{statusText}</div>
    </div>
  );
}
