import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { embedRequestInFlight, loadAndPlayTrack, pauseTrack, trackIsPlaying } from '../embed/embedSlice';
import { selectTrackById } from './tracksSlice';
import { LoadContext, Track } from '../../common/types';
import { log } from '../../main/helpers/console';
import { PlayPauseButton } from './PlayPauseButton';

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
  const dispatch = useDispatch();
  const track = useSelector(selectTrackById(id));
  const isPlaying = useSelector(trackIsPlaying({ trackId: id }));
  const showSpinner = useSelector(embedRequestInFlight());

  if (!track) {
    return <> </>;
  }
  const { artist, title, duration } = track;
  const isPlayingAdditionalStyles = isPlaying ? 'bg-blue-200' : '';

  return (
    <div key={id} className={`group-scope mb-1 px-2 py-1 ${isPlayingAdditionalStyles}`}>
      <span className="inline-block w-32 overflow-hidden whitespace-nowrap overflow-ellipsis">{artist}</span>
      <span className="inline-block overflow-hidden whitespace-nowrap overflow-ellipsis w-80">{title}</span>
      <span className="inline-block w-10 overflow-hidden whitespace-nowrap">{displayTrackDuration(duration)}</span>
      <span className="inline-block w-16 opacity-0 group-scope-hover:opacity-100">
        <PlayPauseButton
          isPlaying={isPlaying}
          showSpinner={showSpinner}
          onClick={() => {
            log('invoke play', { trackId: id, context });
            dispatch(isPlaying ? pauseTrack() : loadAndPlayTrack({ trackId: id, context }));
          }}
        />
      </span>
      <span className="inline-block w-5 opacity-0 group-scope-hover:opacity-100">{additionalButtons}</span>
    </div>
  );
}
