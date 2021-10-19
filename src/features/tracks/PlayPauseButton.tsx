import React, { ReactElement, useState } from 'react';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';
import { SpinnerIcon } from './SpinnerIcon';

export function PlayPauseButton({
  isPlaying,
  isPaused,
  onClick,
}: {
  isPlaying: boolean;
  isPaused: boolean;
  onClick: () => void;
}): ReactElement {
  const [clicked, setClicked] = useState(false);
  const showSpinner = clicked && !isPlaying && !isPaused;
  const showPlay = !clicked && !isPlaying && isPaused;
  const showPause = !clicked && isPlaying && !isPaused;
  if (!showSpinner) {
    setClicked(false);
  }
  return (
    <button
      type="button"
      onClick={() => {
        setClicked(true);
        onClick();
      }}
    >
      {showSpinner && <SpinnerIcon />}
      {showPause && <PauseIcon className="pause" />}
      {showPlay && <PlayIcon className="play" />}
    </button>
  );
}
