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
  const isSmallEmbed = useAppSelector(selectTrackPreviewEmbedSize) === TrackPreviewEmbedSize.Small;
  const isAutoplayEnabled = useAppSelector(selectAutoplayEnabled);
  const embedSize = (isSmall: boolean) => TrackPreviewEmbedSize[isSmall ? 'Small' : 'Medium'];
  return (
    <div>
      <DeleteDataButton />
      <Switch
        id="embed-size-switch"
        isOn={isSmallEmbed}
        text="Small Embed"
        handleToggle={() => {
          batch(() => {
            const size = embedSize(!isSmallEmbed);
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
    </div>
  );
}
