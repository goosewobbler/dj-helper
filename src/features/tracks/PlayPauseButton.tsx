import React, { ReactElement } from 'react';
import { PauseIcon } from './PauseIcon';
import { PlayIcon } from './PlayIcon';

export function PlayPauseButton({ isPlaying, onClick }: { isPlaying: boolean; onClick: () => void }): ReactElement {
  return (
    <button type="button" onClick={() => onClick()}>
      {isPlaying ? <PauseIcon className="pause" /> : <PlayIcon className="play" />}
    </button>
  );
}
