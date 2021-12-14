import React, { ReactElement } from 'react';
import { batch } from 'react-redux';
import { Tab } from '@headlessui/react';
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

export const Tabs = ({ browsers, activeBrowser }: { browsers: Browser[]; activeBrowser: Browser }): ReactElement => {
  const dispatch = useAppDispatch();
  const isSelected = (id: number) => id === activeBrowser.id;

  return (
    <Tab.Group
      defaultIndex={activeBrowser ? activeBrowser.id : 0}
      onChange={(index) => {
        batch(() => {
          log('tab onChange', index);
          dispatch(tabSelected({ id: index }));
          dispatch(updateTabHistory({ tabId: index, action: TabHistoryAction.Selected }));
        });
      }}
    >
      <div className="flex justify-between" data-testid="header">
        <Tab.List>
          {browsers.map(
            (browser: Browser, index: number): ReactElement => (
              <Tab key={browser.id}>
                {() => (
                  <button
                    type="button"
                    className={classNames(
                      isSelected(browser.id) ? 'text-gray-900' : 'text-gray-500 hover:text-gray-700',
                      'rounded-r-lg rounded-l-lg',
                      'group relative min-w-0 flex-1 overflow-hidden bg-white py-4 px-4 text-sm font-medium text-center hover:bg-gray-50 focus:z-10',
                    )}
                  >
                    <span>
                      {browser.title}
                      <button type="button" onClick={() => dispatch(clickCloseTabHandler(index, activeBrowser))}>
                        x
                      </button>
                    </span>
                    <span
                      aria-hidden="true"
                      className={classNames(
                        isSelected(browser.id) ? 'bg-indigo-500' : 'bg-transparent',
                        'absolute inset-x-0 bottom-0 h-0.5',
                      )}
                    />
                  </button>
                )}
              </Tab>
            ),
          )}
          <button
            className="p-1 mx-2 my-0 text-lg border-0 border-solid outline-none text-primary-text"
            type="button"
            onClick={() => dispatch(clickNewTabHandler())}
          >
            +
          </button>
        </Tab.List>
      </div>
      <div className="relative flex flex-col flex-grow w-full h-full" data-testid="panels">
        <Tab.Panels>
          {browsers.map(
            (browser: Browser): ReactElement => (
              <Tab.Panel key={browser.id}>
                <MetaPanel browser={browser} />
              </Tab.Panel>
            ),
          )}
        </Tab.Panels>
      </div>
    </Tab.Group>
  );
};
