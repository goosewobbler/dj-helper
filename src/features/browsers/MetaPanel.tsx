import React, { ReactElement, useState } from 'react';
import { useSelector } from 'react-redux';
import { selectTrackById } from '../tracks/tracksSlice';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';

declare global {
  interface Window {
    api: { isDev: boolean };
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
  const [embedActive, setEmbedActive] = useState(false);
  const { artist, title, duration, sources, playing } = useSelector(selectTrackById(id));
  // const [embedIsPlaying, setEmbedIsPlaying] = useState(false);
  log('zomg loading track', sources, playing);

  // useEffect(() => {
  //   window.addEventListener(
  //     'embedPlaying',
  //     () => {
  //       console.log('received playing');
  //       setEmbedIsPlaying(true);
  //     },
  //     false,
  //   );

  //   window.addEventListener(
  //     'embedStopped',
  //     () => {
  //       console.log('received stopped');
  //       setEmbedIsPlaying(false);
  //     },
  //     false,
  //   );
  // });

  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      <span>{playing ? 'OMG this is playing' : ''}</span>
      {embedActive ? (
        <iframe
          id="bandcamp"
          title={title}
          style={{ border: 0, width: '100%', height: '42px' }}
          src={`https://bandcamp.com/EmbeddedPlayer/size=small/bgcol=ffffff/linkcol=0687f5/track=${sources[0].sourceId}/transparent=true/`}
          seamless
          // onLoad={() => {
          //   let embedPlaying = false;
          //   window.setInterval(() => {
          //     const parentOrigin = isDev ? 'http://localhost:1212' : 'file:///';
          //     const nowPlaying = document.getElementById('player')?.classList.contains('playing');
          //     console.log(
          //       'wut',
          //       embedPlaying,
          //       nowPlaying,
          //       document.title,
          //       document.getElementById('player'),
          //       window.document.getElementById('player')?.classList,
          //     );
          //     if (!embedPlaying && nowPlaying) {
          //       console.log('sending msg - playing');
          //       window.parent.postMessage('embedPlaying', parentOrigin);
          //       embedPlaying = true;
          //     }
          //     if (embedPlaying && !nowPlaying) {
          //       console.log('sending msg - stopped');
          //       window.parent.postMessage('embedStopped', parentOrigin);
          //       embedPlaying = false;
          //     }
          //   }, 1000);
          // }}
        />
      ) : (
        <button type="button" onClick={() => setEmbedActive(true)}>
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
