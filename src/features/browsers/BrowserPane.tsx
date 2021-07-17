import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { selectTracksByBrowserId } from '../tracks/tracksSlice';
import { Browser } from '../../common/types';

import { MetaPanel } from './MetaPanel';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  const tracks = useSelector(selectTracksByBrowserId(browser.id));
  return (
    <div>
      <MetaPanel tracks={tracks} />
      <div className="browserPanel" />
    </div>
  );
}
