import React, { ReactElement } from 'react';
import { Track } from '../../common/types';
import { TrackMeta } from '../tracks/TrackMeta';

export function MetaPanel({ tracks }: { tracks: Track[] }): ReactElement {
  return (
    <div>
      {tracks.map(({ id }) => (
        <TrackMeta key={id} id={id} context="metapanel" />
      ))}
    </div>
  );
}
