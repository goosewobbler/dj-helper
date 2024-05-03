import React, { ReactElement } from 'react';

import { embedRequestInFlight, loadAndPlayTrack, trackIsPlaying } from '../embed/index.js';
import { selectTrackById } from './index.js';
import { LoadContext, Track } from '../../common/types.js';
import { log } from '../../main/helpers/console.js';
import { PlayPauseButton } from './PlayPauseButton.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { useStore } from '../../renderer/hooks/useStore.js';

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
  const track = useStore(selectTrackById(id));
  const isPlaying = useStore(trackIsPlaying({ trackId: id }));
  const showSpinner = useStore(embedRequestInFlight({ trackId: id }));
  const dispatch = useDispatch();

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
      <span className="relative inline-block w-2/12 font-serif align-middle opacity-0 bottom-1 group-track-hover:opacity-100">
        <span className="">{additionalButtons}</span>
        <span className="float-left mx-2">
          <PlayPauseButton
            isPlaying={isPlaying}
            showSpinner={showSpinner}
            onClick={() => {
              log('invoke play', { trackId: id, context });
              if (isPlaying) {
                dispatch('EMBED:REQUEST_PAUSE');
              } else {
                dispatch(loadAndPlayTrack({ trackId: id, context }));
              }
            }}
          />
        </span>
      </span>
    </div>
  );
}
