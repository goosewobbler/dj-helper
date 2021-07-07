import React, { ReactElement } from 'react';
import { Browser } from '../../common/types';
import { MetaPanel } from './MetaPanel';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  const browserTracks = browser.tracks;
  return (
    <div>
      <MetaPanel tracks={browserTracks} />
      <div className="browserPanel" />
    </div>
  );
}
