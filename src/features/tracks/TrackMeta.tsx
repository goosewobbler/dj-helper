import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPause, requestPlay, trackIsPlaying } from '../embed/embedSlice';
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
import { PlayPauseButton } from './PlayPauseButton';
import { AddRemoveListButton } from './AddRemoveListButton';
import { CrossIcon } from './CrossIcon';
import { UpArrowIcon } from './UpArrowIcon';
import { DownArrowIcon } from './DownArrowIcon';

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
    <div key={id} className="group">
      <span
        className={`inline-block overflow-hidden whitespace-nowrap overflow-ellipsis ${
          isListContext ? 'w-24' : 'w-32'
        }`}
      >
        {artist}
      </span>
      <span
        className={`inline-block overflow-hidden whitespace-nowrap overflow-ellipsis ${
          isListContext ? 'w-56' : 'w-80'
        }`}
      >
        {title}
      </span>
      <span className="inline-block w-10 overflow-hidden whitespace-nowrap">{displayTrackDuration(duration)}</span>
      <span className="inline-block w-10 opacity-0 group-hover:opacity-100">
        {isListContext && (listIndex as number) > 0 && (
          <button
            type="button"
            onClick={() => {
              dispatch(moveTrackUp({ trackId: id }));
            }}
          >
            <UpArrowIcon className="up-arrow-icon" />
          </button>
        )}
        {isListContext && (listIndex as number) < (listTotalTracks as number) - 1 && (
          <button
            type="button"
            onClick={() => {
              dispatch(moveTrackDown({ trackId: id }));
            }}
          >
            <DownArrowIcon className="down-arrow-icon" />
          </button>
        )}
      </span>
      <span className="inline-block w-5">
        <PlayPauseButton
          isPlaying={isPlaying}
          onClick={() => {
            log('invoke play', { trackId: id, context });
            dispatch(isPlaying ? requestPause() : requestPlay({ trackId: id, context }));
          }}
        />
      </span>
      {isListContext && isOnSelectedList && (
        <button
          type="button"
          onClick={() => {
            dispatch(removeTrackFromSelectedList({ trackId: id }));
          }}
        >
          <CrossIcon className="cross-icon" />
        </button>
      )}
      {isBrowserContext && (
        <AddRemoveListButton
          isOnSelectedList={isOnSelectedList}
          onClick={() => {
            if (isOnSelectedList) {
              dispatch(removeTrackFromSelectedList({ trackId: id }));
            } else {
              dispatch(addTrackToSelectedList({ trackId: id }));
            }
          }}
        />
      )}
    </div>
  );
}
