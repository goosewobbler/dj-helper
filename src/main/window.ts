import { BrowserWindow } from 'electron';
import { AppStore } from '../common/types';
import { setSetting } from '../features/settings/settingsSlice';

export function initWindow(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { dispatch, subscribe, getState } = reduxStore;

  function storeWindowBounds() {
    const { x, y, width, height } = mainWindow.getBounds();
    dispatch(setSetting({ settingKey: 'windowBounds', settingValue: { x, y, width, height } }));
  }

  mainWindow.on('resize', storeWindowBounds);
  mainWindow.on('move', storeWindowBounds);

  subscribe(() => {
    const { windowBounds } = getState().settings;

    if (windowBounds !== mainWindow.getBounds()) {
      mainWindow.setBounds(windowBounds, true);
    }
  });
}
