import React, { ReactElement } from 'react';
import { useDispatch, useSelector, batch } from 'react-redux';
import { getSettingValue, setSetting } from './settingsSlice';
import { requestLoad } from '../embed/embedSlice';
import { setResizing } from '../status/statusSlice';
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
        isOn={isSmallEmbed}
        handleToggle={() => {
          batch(() => {
            dispatch(setSetting({ settingKey: 'trackPreviewEmbedSize', settingValue: embedSize(!isSmallEmbed) }));
            dispatch(setResizing());
            dispatch(requestLoad());
          });
        }}
      />
    </div>
  );
}
