import React, { ReactElement } from 'react';
import { batch } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useAppDispatch } from '../../common/hooks';
import { createBrowser, deleteBrowser, tabSelected } from './browsersSlice';
import { AppThunk, Browser, TabHistoryAction } from '../../common/types';
import { MetaPanel } from './MetaPanel';
import { updateTabHistory } from '../ui/uiSlice';
import { log } from '../../main/helpers/console';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

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
                    ? 'text-gray-900 cursor-default'
                    : 'text-gray-500 hover:text-gray-700 cursor-pointer',
                  'float-left rounded-r-lg rounded-l-lg w-80 overflow-hidden overflow-ellipsis whitespace-nowrap',
                  'group relative min-w-0 flex-1 bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                )}
              >
                {displayTabCloseButton && (
                  <button
                    className="absolute w-5 h-5 right-1"
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      dispatch(clickCloseTabHandler(index, activeBrowser));
                    }}
                  >
                    x
                  </button>
                )}
                <span className="overflow-hidden w-60 overflow-ellipsis whitespace-nowrap">{browser.title}</span>
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
            className="p-1 mx-2 mt-2 text-lg border-0 border-solid outline-none text-primary-text"
            type="button"
            onClick={() => dispatch(clickNewTabHandler())}
          >
            +
          </button>
        </TabList>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full" data-testid="panels">
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
