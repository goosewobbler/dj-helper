import React, { ReactElement } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { getSettingValue, setSetting } from './settingsSlice';
import { resizeEmbed } from '../embed/embedSlice';
import { DeleteDataButton } from './DeleteDataButton';
import { Switch } from './Switch';
import { TrackPreviewEmbedSize } from '../../common/types';

export function SettingsPanel(): ReactElement {
  const dispatch = useDispatch();
  const isSmallEmbed =
    useSelector(getSettingValue({ settingKey: 'trackPreviewEmbedSize' })) === TrackPreviewEmbedSize.Small;
  const embedSize = (isSmall: boolean) => TrackPreviewEmbedSize[isSmall ? 'Small' : 'Medium'];
  return (
    <div>
      <DeleteDataButton />
      <Switch
        id="embed-size-switch"
        isOn={isSmallEmbed}
        handleToggle={() => {
          batch(() => {
            const size = embedSize(!isSmallEmbed);
            dispatch(setSetting({ settingKey: 'trackPreviewEmbedSize', settingValue: size }));
            dispatch(resizeEmbed());
          });
        }}
      />
    </div>
  );
}
