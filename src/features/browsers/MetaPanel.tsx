import React, { ReactElement } from 'react';
import { Browser, LoadContextType } from '../../common/types';
import { log } from '../../main/helpers/console';
import { TrackMeta } from '../tracks/TrackMeta';

export function MetaPanel({ browser: { id, tracks } }: { browser: Browser }): ReactElement {
  log('tracks', tracks);

  return (
    <div className="inline-block w-full overflow-scroll h-80">
      {tracks?.map((trackId) => (
        <TrackMeta key={trackId} id={trackId} context={{ contextId: id, contextType: LoadContextType.Browser }} />
      ))}
    </div>
  );
}
