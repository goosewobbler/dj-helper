import React, { ReactElement } from 'react';

import { DeleteDataButton } from './DeleteDataButton.js';
import { Switch } from './Switch.js';
import { TrackPreviewEmbedSize } from '../../common/types.js';
import { useStore } from '../../renderer/hooks/useStore.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { selectTrackPreviewEmbedSize } from './index.js';
import { selectAutoplayEnabled } from '../embed/index.js';

export function SettingsPanel(): ReactElement {
  const dispatch = useDispatch();
  const isMediumEmbed = useStore(selectTrackPreviewEmbedSize(TrackPreviewEmbedSize.Medium));
  const isAutoplayEnabled = useStore(selectAutoplayEnabled);
  const embedSize = (isMedium: boolean) => TrackPreviewEmbedSize[isMedium ? 'Medium' : 'Small'];
  return (
    <div>
      <DeleteDataButton />
      <div className="float-right w-6/12">
        <span className="float-right mx-4">
          <Switch
            id="embed-size-switch"
            isOn={isMediumEmbed}
            text="Large Preview"
            handleToggle={() => {
              const size = embedSize(!isMediumEmbed);
              dispatch('UI:TRACK_PREVIEW_EMBED_SIZE_TOGGLED', size);
              dispatch('EMBED:REQUEST_LOAD', { isResize: true });
            }}
          />
          <Switch
            id="autoplay-switch"
            isOn={isAutoplayEnabled}
            text="Autoplay"
            handleToggle={() => {
              dispatch('EMBED:AUTOPLAY_TOGGLED', !isAutoplayEnabled);
            }}
          />
        </span>
      </div>
    </div>
  );
}
