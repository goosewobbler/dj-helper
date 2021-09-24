import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackIsPlaying } from '../embed/embedSlice';
import { selectTrackById } from './tracksSlice';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { addTrackToSelectedList } from '../lists/listsSlice';

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

export function TrackMeta({ id, context }: { id: Track['id']; context: string }) {
  const dispatch = useDispatch();
  const { artist, title, duration, sources } = useSelector(selectTrackById(id));
  const isPlaying = useSelector(trackIsPlaying({ trackId: id }));
  log('zomg loading track', { artist, title, duration, sources });

  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      {context === 'metapanel' && (
        <button
          type="button"
          onClick={() => {
            dispatch(addTrackToSelectedList({ trackId: id }));
          }}
        >
          Add To List
        </button>
      )}
      <span>
        {isPlaying ? (
          'OMG this is playing'
        ) : (
          <button
            type="button"
            onClick={() => {
              void window.api.invoke('play-track', { trackId: id, context });
            }}
          >
            Play
          </button>
        )}
      </span>
    </div>
  );
}
