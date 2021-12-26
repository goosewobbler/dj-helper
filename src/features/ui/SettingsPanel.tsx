import React, { ReactElement } from 'react';
import { batch } from 'react-redux';
import { selectTrackPreviewEmbedSize, trackPreviewEmbedSizeToggled } from './uiSlice';
import { autoplayEnabledToggled, resizeEmbed, selectAutoplayEnabled } from '../embed/embedSlice';
import { DeleteDataButton } from './DeleteDataButton';
import { Switch } from './Switch';
import { TrackPreviewEmbedSize } from '../../common/types';
import { useAppDispatch, useAppSelector } from '../../common/hooks';

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
              batch(() => {
                const size = embedSize(!isLargeEmbed);
                dispatch(trackPreviewEmbedSizeToggled(size));
                dispatch(resizeEmbed());
              });
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
