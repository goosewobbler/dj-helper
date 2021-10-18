import React, { ReactElement } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { getSettingValue, setSetting } from './settingsSlice';
import { requestResize } from '../embed/embedSlice';
import { DeleteDataButton } from './DeleteDataButton';
import { Switch } from './Switch';

export function SettingsPanel(): ReactElement {
  const dispatch = useDispatch();
  const isSmallEmbed = useSelector(getSettingValue({ settingKey: 'trackPreviewEmbedSize' })) === 'small';
  const embedSize = (isSmall: boolean) => (isSmall ? 'small' : 'med');
  return (
    <div>
      <DeleteDataButton />
      <Switch
        id="embed-size-switch"
        isOn={isSmallEmbed}
        handleToggle={() => {
          batch(() => {
            dispatch(setSetting({ settingKey: 'trackPreviewEmbedSize', settingValue: embedSize(!isSmallEmbed) }));
            dispatch(requestResize());
          });
        }}
      />
    </div>
  );
}
