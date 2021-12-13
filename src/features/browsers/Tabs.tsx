import React, { ReactElement } from 'react';
import { Tab } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../common/hooks';
import { createBrowser, selectActiveBrowser, tabClosed, tabSelected } from './browsersSlice';
import { Browser } from '../../common/types';
import { MetaPanel } from './MetaPanel';

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

export const Tabs = ({ browsers }: { browsers: Browser[] }): ReactElement => {
  const dispatch = useAppDispatch();
  const activeBrowser = useAppSelector(selectActiveBrowser());
  const isSelected = (id: number) => id === activeBrowser.id;

  return (
    <Tab.Group
      defaultIndex={activeBrowser.id}
      onChange={(index) => {
        dispatch(tabSelected({ id: index }));
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
                      <button type="button" onClick={() => dispatch(tabClosed({ id: index }))}>
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
            onClick={() => dispatch(createBrowser({}))}
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
