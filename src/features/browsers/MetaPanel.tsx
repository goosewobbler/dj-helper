import React, { ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTrackById } from '../tracks/tracksSlice';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { loadTrack, trackIsLoaded, trackIsPlaying } from '../embed/embedSlice';

declare global {
  interface Window {
    api: {
      isDev: boolean;
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
  const { artist, title, duration, sources, playingFrom } = useSelector(selectTrackById(id));
  const isPlaying = useSelector(trackIsPlaying({ trackId: id }));
  const isLoaded = useSelector(trackIsLoaded({ trackId: id }));
  log('zomg loading track', { artist, title, duration, sources, playingFrom });

  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      <span>{isPlaying ? 'OMG this is playing' : ''}</span>
      {isLoaded || (
        <button
          type="button"
          onClick={() => {
            dispatch(loadTrack({ trackId: id, context: 'metapanel' }));
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
