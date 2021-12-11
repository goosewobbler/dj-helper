import React, { ReactElement } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { selectTrackPreviewEmbedSize, trackPreviewEmbedSizeToggled } from './uiSlice';
import { autoplayEnabledToggled, resizeEmbed, selectAutoplayEnabled } from '../embed/embedSlice';
import { DeleteDataButton } from './DeleteDataButton';
import { Switch } from './Switch';
import { TrackPreviewEmbedSize } from '../../common/types';

export function SettingsPanel(): ReactElement {
  const dispatch = useDispatch();
  const isSmallEmbed = useSelector(selectTrackPreviewEmbedSize) === TrackPreviewEmbedSize.Small;
  const isAutoplayEnabled = useSelector(selectAutoplayEnabled);
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
