import React, { ReactElement } from 'react';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { TrackMeta } from '../tracks/TrackMeta';

export function MetaPanel({ tracks }: { tracks: Track['id'][] }): ReactElement {
  log('tracks', tracks);
  return (
    <div>
      {tracks?.map((trackId) => (
        <TrackMeta key={trackId} id={trackId} context="metapanel" />
      ))}
    </div>
  );
}
