import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTrackById, setEmbedActive } from '../tracks/tracksSlice';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { Bounds } from '../../main/trackEmbed';

declare global {
  interface Window {
    api: {
      isDev: boolean;
      track: {
        createEmbed(url: string, bounds: Bounds): Promise<unknown>;
      };
    };
  }
}

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

function TrackMeta({ id }: { id: Track['id'] }) {
  const dispatch = useDispatch();
  const { artist, title, duration, sources, playing, embedActive } = useSelector(selectTrackById(id));
  // const [embedIsPlaying, setEmbedIsPlaying] = useState(false);
  log('zomg loading track', { artist, title, duration, sources, playing, embedActive });

  if (embedActive) {
    void window.api.track.createEmbed(
      `https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${sources[0].sourceId}/transparent=true/`,
      {
        x: 900,
        y: 10,
        width: 400,
        height: 42,
      },
    );
  }

  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      <span>{playing ? 'OMG this is playing' : ''}</span>
      {embedActive || (
        <button
          type="button"
          onClick={() => {
            dispatch(setEmbedActive({ sourceId: sources[0].sourceId }));
          }}
        >
          Play
        </button>
      )}
    </div>
  );
}

export function MetaPanel({ tracks }: { tracks: Track[] }): ReactElement {
  return (
    <div>
      {tracks.map(({ id }) => (
        <TrackMeta key={id} id={id} />
      ))}
    </div>
  );
}
