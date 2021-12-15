import React, { ReactElement } from 'react';
import { PauseIcon } from '../../common/icons/PauseIcon';
import { PlayIcon } from '../../common/icons/PlayIcon';
import { SpinnerIcon } from '../../common/icons/SpinnerIcon';

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
    <button className="cursor-pointer" type="button" onClick={() => onClick()}>
      {isPlaying ? <PauseIcon className="pause" /> : <PlayIcon className="play" />}
    </button>
  );
}
