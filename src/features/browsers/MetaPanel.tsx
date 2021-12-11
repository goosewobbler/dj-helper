import React, { ReactElement } from 'react';
import { Browser, LoadContextType } from '../../common/types';
import { log } from '../../main/helpers/console';
import { BrowserTrack } from '../tracks/BrowserTrack';

export function MetaPanel({ browser: { id, tracks } }: { browser: Browser }): ReactElement {
  log('tracks', tracks);

  return (
    <div className="inline-block w-full overflow-y-scroll">
      {tracks?.map((trackId) => (
        <BrowserTrack key={trackId} id={trackId} context={{ contextId: id, contextType: LoadContextType.Browser }} />
      ))}
    </div>
  );
}
