import React, { ReactElement, useState } from 'react';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

function TrackMeta({ id, artist, title, duration, sources }: Track) {
  const [playing, setPlaying] = useState(false);
  log('loading track', sources);
  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      {playing ? (
        <iframe
          title={title}
          style={{ border: 0, width: '100%', height: '42px' }}
          src={`https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${sources[0].sourceId}/transparent=true/`}
          seamless
        />
      ) : (
        <button type="button" onClick={() => setPlaying(true)}>
          Play
        </button>
      )}
    </div>
  );
}

export function MetaPanel({ tracks }: { tracks: Track[] }): ReactElement {
  return (
    <div>
      {tracks.map(({ id, artist, title, duration, sources }) => (
        <TrackMeta key={id} id={id} artist={artist} title={title} duration={duration} sources={sources} />
      ))}
    </div>
  );
}
