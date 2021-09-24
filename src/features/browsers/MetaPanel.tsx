import React, { ReactElement } from 'react';
import { Browser } from '../../common/types';
import { log } from '../../main/helpers/console';
import { TrackMeta } from '../tracks/TrackMeta';

export function MetaPanel({ browser: { id, tracks } }: { browser: Browser }): ReactElement {
  log('tracks', tracks);
  return (
    <div>
      {tracks?.map((trackId) => (
        <TrackMeta key={trackId} id={trackId} context={`browser-${id}`} />
      ))}
    </div>
  );
}
