import React, { ReactElement } from 'react';

import { selectTrackPreviewEmbedSize, trackPreviewEmbedSizeToggled } from './uiSlice.js';
import { autoplayEnabledToggled, resizeEmbed, selectAutoplayEnabled } from '../embed/embedSlice.js';
import { DeleteDataButton } from './DeleteDataButton.js';
import { Switch } from './Switch.js';
import { TrackPreviewEmbedSize } from '../../common/types.js';
import { useAppDispatch, useAppSelector } from '../../common/hooks.js';

export function SettingsPanel(): ReactElement {
  const dispatch = useAppDispatch();
  const isLargeEmbed = useAppSelector(selectTrackPreviewEmbedSize) === TrackPreviewEmbedSize.Medium;
  const isAutoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const embedSize = (isLarge: boolean) => TrackPreviewEmbedSize[isLarge ? 'Medium' : 'Small'];
  return (
    <div>
      <DeleteDataButton />
      <div className="float-right w-6/12">
        <span className="float-right mx-4">
          <Switch
            id="embed-size-switch"
            isOn={isLargeEmbed}
            text="Large Preview"
            handleToggle={() => {
              const size = embedSize(!isLargeEmbed);
              dispatch(trackPreviewEmbedSizeToggled(size));
              dispatch(resizeEmbed());
            }}
          />
          <Switch
            id="autoplay-switch"
            isOn={isAutoplayEnabled}
            text="Autoplay"
            handleToggle={() => {
              const autoplayEnabled = !isAutoplayEnabled;
              dispatch(autoplayEnabledToggled(autoplayEnabled));
            }}
          />
        </span>
      </div>
    </div>
  );
}
