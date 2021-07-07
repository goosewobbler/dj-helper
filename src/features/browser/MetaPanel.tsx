import React, { ReactElement } from 'react';
import { Track } from '../../common/types';

export function MetaPanel({ tracks }: { tracks: Track[] }): ReactElement {
  return (
    <div>
      {tracks.map((track) => (
        <div>
          <span>{track.artist}</span>
          <span>{track.title}</span>
        </div>
      ))}
    </div>
  );
}
