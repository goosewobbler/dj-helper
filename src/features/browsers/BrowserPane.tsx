import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Browser } from '../../common/types';
import { log } from '../../main/helpers/console';
import { selectTracks } from '../tracks/tracksSlice';
import { MetaPanel } from './MetaPanel';

export function BrowserPane({ browser }: { browser: Browser }): ReactElement {
  const browserTracks = useSelector(selectTracks).filter((track) => track.browserId === browser.id);
  log('BP browsertracks', browserTracks);
  log('BP tracks', useSelector(selectTracks));
  return (
    <div>
      <MetaPanel tracks={browserTracks} />
      <div className="browserPanel" />
    </div>
  );
}
