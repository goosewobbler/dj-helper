import React, { ReactElement } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';

import { getActiveBrowser } from './index.js';
import { AppState, Browser, TabHistoryAction, UI } from '../../common/types.js';
import { MetaPanel } from './MetaPanel.js';
import { log } from '../../main/helpers/console.js';
import { CrossIcon } from '../../icons/CrossIcon.js';
import { NewTabIcon } from '../../icons/NewTabIcon.js';
import { useDispatch } from '../../renderer/hooks/useDispatch.js';
import { useStore } from '../../renderer/hooks/useStore.js';
import { Thunk } from 'zutron';

const clickNewTabHandler = (): Thunk<AppState> => (dispatch, store) => {
  const { bandcampPageUrls, bandcampTabHomepage } = store.getState().ui as UI;
  dispatch('BROWSER:CREATE', { url: bandcampPageUrls[bandcampTabHomepage] });
  const browsers = store.getState().browsers as Browser[];
  const newBrowser = browsers[browsers.length - 1];
  dispatch('UI:UPDATE_TAB_HISTORY', { tabId: newBrowser.id, action: TabHistoryAction.Created });
};

const clickCloseTabHandler =
  (tabIndex: number, activeBrowser: Browser): Thunk<AppState> =>
  (dispatch, store) => {
    dispatch('UI:UPDATE_TAB_HISTORY', { tabId: tabIndex, action: TabHistoryAction.Deleted });
    if (tabIndex === activeBrowser.id) {
      const { tabHistory } = store.getState().ui as UI;
      const previouslyActiveBrowserId = tabHistory[tabHistory.length - 1];
      dispatch('BROWSER:TAB_SELECTED', { id: previouslyActiveBrowserId });
      log('selected tab', previouslyActiveBrowserId, tabHistory);
    }
    dispatch('BROWSER:DELETE', { id: tabIndex });
  };

export const TabbedInterface = (): ReactElement => {
  const dispatch = useDispatch();
  const browsers = useStore((state) => state.browsers) || [];
  const activeBrowser = getActiveBrowser(browsers);
  const isSelected = (id: number) => id === activeBrowser.id;
  const displayTabCloseButton = browsers.length > 1;

  return (
    <Tabs
      className="h-full"
      onSelect={(index: number) => {
        log('tab onSelect', index);
        if (index !== activeBrowser.id) {
          dispatch('BROWSER:TAB_SELECTED', { id: index });
          dispatch('UI:UPDATE_TAB_HISTORY', { tabId: index, action: TabHistoryAction.Selected });
        }
      }}
      selectedIndex={activeBrowser ? activeBrowser.id : 0}
    >
      <div className="flex justify-between" data-testid="header">
        <TabList className="flex-grow">
          {browsers.map(
            (browser: Browser, index: number): ReactElement => (
              <Tab
                key={browser.id}
                className={classNames(
                  isSelected(browser.id)
                    ? 'text-gray-900 font-extrabold cursor-default'
                    : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  'float-left rounded-r-lg rounded-l-lg w-72 overflow-hidden overflow-ellipsis whitespace-nowrap',
                  'group-tab relative min-w-0 flex-1 bg-white pt-4 pb-4 pl-9 pr-7 text-sm font-medium text-left hover:bg-gray-100 focus:z-10',
                )}
              >
                {displayTabCloseButton && (
                  <button
                    className="absolute w-5 h-5 opacity-0 right-2 hover:bg-red-100 group-tab-hover:opacity-100"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(clickCloseTabHandler(index, activeBrowser));
                    }}
                  >
                    <CrossIcon className="cross-icon" />
                  </button>
                )}
                {browser.loading ? (
                  <div className="absolute w-5 h-5 overflow-hidden top-4 left-3">
                    <div className="relative w-full h-full spinner-eclipse">
                      <div className="box-content absolute top-0.5 left-0.5 w-4 h-4 rounded-xl animate-spin spinner-eclipse-shadow" />
                    </div>
                  </div>
                ) : (
                  <img className="absolute w-5 h-5 top-4 left-3" alt="favicon" src="./bandcamp-favicon-32x32.png" />
                )}
                <span>{browser.title}</span>
                <span
                  aria-hidden="true"
                  className={classNames(
                    isSelected(browser.id) ? 'bg-indigo-500' : 'bg-transparent',
                    'absolute inset-x-0 bottom-0 h-0.5',
                  )}
                />
              </Tab>
            ),
          )}
          <button
            className="float-left px-4 py-4 text-lg border-0 border-solid rounded-l-lg rounded-r-lg outline-none hover:bg-gray-100 text-primary-text"
            type="button"
            aria-label="New Tab"
            onClick={() => dispatch(clickNewTabHandler())}
          >
            <NewTabIcon className="" />
          </button>
        </TabList>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full mt-2 text-sm" data-testid="panels">
        {browsers.map(
          (browser: Browser): ReactElement => (
            <TabPanel key={browser.id} className="inline-block w-full overflow-y-scroll">
              <MetaPanel browser={browser} />
            </TabPanel>
          ),
        )}
      </div>
    </Tabs>
  );
};
