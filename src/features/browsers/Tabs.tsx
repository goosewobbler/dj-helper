import React, { ReactElement } from 'react';
import { batch } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import classNames from 'classnames';
import { useAppDispatch } from '../../common/hooks';
import { createBrowser, deleteBrowser, tabSelected } from './browsersSlice';
import { AppThunk, Browser, TabHistoryAction } from '../../common/types';
import { MetaPanel } from './MetaPanel';
import { updateTabHistory } from '../ui/uiSlice';
import { log } from '../../main/helpers/console';
import { CrossIcon } from '../../icons/CrossIcon';
import { NewTabIcon } from '../../icons/NewTabIcon';

const clickNewTabHandler = (): AppThunk => (dispatch, getState) => {
  batch(() => {
    dispatch(createBrowser({}));
    const { browsers } = getState();
    const newBrowser = browsers[browsers.length - 1];
    dispatch(updateTabHistory({ tabId: newBrowser.id, action: TabHistoryAction.Created }));
  });
};

const clickCloseTabHandler =
  (tabIndex: number, activeBrowser: Browser): AppThunk =>
  (dispatch, getState) => {
    batch(() => {
      dispatch(updateTabHistory({ tabId: tabIndex, action: TabHistoryAction.Deleted }));
      if (tabIndex === activeBrowser.id) {
        const {
          ui: { tabHistory },
        } = getState();
        const previouslyActiveBrowserId = tabHistory[tabHistory.length - 1];
        dispatch(tabSelected({ id: previouslyActiveBrowserId }));
        log('selected tab', previouslyActiveBrowserId, tabHistory);
      }
      dispatch(deleteBrowser({ id: tabIndex }));
    });
  };

export const TabbedInterface = ({
  browsers,
  activeBrowser,
}: {
  browsers: Browser[];
  activeBrowser: Browser;
}): ReactElement => {
  const dispatch = useAppDispatch();
  const isSelected = (id: number) => id === activeBrowser.id;
  const displayTabCloseButton = browsers.length > 1;

  return (
    <Tabs
      className="h-full"
      defaultIndex={activeBrowser ? activeBrowser.id : 0}
      onSelect={(index: number) => {
        batch(() => {
          log('tab onSelect', index);
          if (index !== activeBrowser.id) {
            dispatch(tabSelected({ id: index }));
            dispatch(updateTabHistory({ tabId: index, action: TabHistoryAction.Selected }));
          }
        });
      }}
      selectedIndex={activeBrowser.id}
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
                  <img className="absolute w-5 h-5 top-4 left-3" src="./bandcamp-favicon-32x32.png" />
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
