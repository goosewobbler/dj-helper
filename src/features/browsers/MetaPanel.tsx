import React, { ReactElement } from 'react';

import { log } from '../../main/helpers/console.js';
import { BrowserTrack } from '../tracks/BrowserTrack.js';
import { Browser, LoadContextType } from '../../common/types.js';

export function MetaPanel({ browser: { id, tracks } }: { browser: Browser }): ReactElement {
  log('tracks', tracks);

  return (
    <div>
      {tracks?.map((trackId) => (
        <BrowserTrack key={trackId} id={trackId} context={{ contextId: id, contextType: LoadContextType.Browser }} />
      ))}
    </div>
  );
}
