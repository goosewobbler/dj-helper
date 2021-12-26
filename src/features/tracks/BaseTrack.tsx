import React, { ReactElement } from 'react';
import { embedRequestInFlight, loadAndPlayTrack, pauseTrack, trackIsPlaying } from '../embed/embedSlice';
import { selectTrackById } from './tracksSlice';
import { LoadContext, Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { PlayPauseButton } from './PlayPauseButton';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

function displayTrackDuration(duration: number) {
  const date = new Date(duration * 1000);
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return hours === '00' ? `${minutes}:${seconds}` : `${hours}:${minutes}:${seconds}`;
}

export function BaseTrack({
  id,
  context,
  additionalButtons,
}: {
  id: Track['id'];
  context: LoadContext;
  additionalButtons: ReactElement;
}) {
  const dispatch = useAppDispatch();
  const track = useAppSelector(selectTrackById(id));
  const isPlaying = useAppSelector(trackIsPlaying({ trackId: id }));
  const showSpinner = useAppSelector(embedRequestInFlight());

  if (!track) {
    return <> </>;
  }
  const { artist, title, duration } = track;
  const isPlayingAdditionalStyles = isPlaying ? 'bg-blue-200' : '';

  return (
    <div key={id} className={`group-track mb-1 px-2 py-1 ${isPlayingAdditionalStyles}`}>
      <span className="inline-block w-3/12 overflow-hidden whitespace-nowrap overflow-ellipsis">{artist}</span>
      <span className="inline-block w-6/12 overflow-hidden whitespace-nowrap overflow-ellipsis">{title}</span>
      <span className="inline-block w-1/12 overflow-hidden whitespace-nowrap">{displayTrackDuration(duration)}</span>
      <span className="inline-block w-2/12 opacity-0 group-track-hover:opacity-100">
        <PlayPauseButton
          isPlaying={isPlaying}
          showSpinner={showSpinner}
          onClick={() => {
            log('invoke play', { trackId: id, context });
            dispatch(isPlaying ? pauseTrack() : loadAndPlayTrack({ trackId: id, context }));
          }}
        />
        <span className="ml-1">{additionalButtons}</span>
      </span>
    </div>
  );
}
