import React, { ReactElement } from 'react';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';
import { SpinnerIcon } from './SpinnerIcon';

export function PlayPauseButton({
  isPlaying,
  showSpinner,
  onClick,
}: {
  isPlaying: boolean;
  showSpinner: boolean;
  onClick: () => void;
}): ReactElement {
  return showSpinner ? (
    <SpinnerIcon className="animate-spin" />
  ) : (
    <button type="button" onClick={() => onClick()}>
      {isPlaying ? <PauseIcon className="pause" /> : <PlayIcon className="play" />}
    </button>
  );
}
