import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { trackIsPlaying } from '../embed/embedSlice';
import { selectTrackById } from './tracksSlice';
import { Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import {
  addTrackToSelectedList,
  moveTrackDown,
  moveTrackUp,
  removeTrackFromSelectedList,
  trackIsOnSelectedList,
} from '../lists/listsSlice';

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

export function TrackMeta({
  id,
  context,
  listIndex,
  listTotalTracks,
}: {
  id: Track['id'];
  context: string;
  listIndex?: number;
  listTotalTracks?: number;
}) {
  const dispatch = useDispatch();
  const track = useSelector(selectTrackById(id));
  const isPlaying = useSelector(trackIsPlaying({ trackId: id }));
  const isOnSelectedList = useSelector(trackIsOnSelectedList({ trackId: id }));
  if (!track) {
    return <></>;
  }
  const { artist, title, duration, sources } = track;
  const isListContext = context.startsWith('list-');
  const isBrowserContext = context.startsWith('browser-');
  log('zomg loading track', { artist, title, duration, sources });

  return (
    <div key={id}>
      <span>{artist}</span>
      <span>{title}</span>
      <span>{displayTrackDuration(duration)}</span>
      {isBrowserContext && (
        <button
          type="button"
          onClick={() => {
            if (isOnSelectedList) {
              dispatch(removeTrackFromSelectedList({ trackId: id }));
            } else {
              dispatch(addTrackToSelectedList({ trackId: id }));
            }
          }}
        >
          {isOnSelectedList ? 'Remove From' : 'Add To'} List
        </button>
      )}
      {isListContext && isOnSelectedList && (
        <button
          type="button"
          onClick={() => {
            dispatch(removeTrackFromSelectedList({ trackId: id }));
          }}
        >
          Remove From List
        </button>
      )}
      {isListContext && (listIndex as number) > 0 && (
        <button
          type="button"
          onClick={() => {
            dispatch(moveTrackUp({ trackId: id }));
          }}
        >
          Move Track Up
        </button>
      )}
      {isListContext && (listIndex as number) < (listTotalTracks as number) - 1 && (
        <button
          type="button"
          onClick={() => {
            dispatch(moveTrackDown({ trackId: id }));
          }}
        >
          Move Track Down
        </button>
      )}
      <span>
        {isPlaying ? (
          'OMG this is playing'
        ) : (
          <button
            type="button"
            onClick={async () => {
              log('invoke play', { trackId: id, context });
              await window.api.invoke('play-track', { trackId: id, context });
            }}
          >
            Play
          </button>
        )}
      </span>
    </div>
  );
}