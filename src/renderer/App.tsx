import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Browser } from '../common/types';
import { BrowserPane } from '../features/browsers/BrowserPane';
import { selectBrowsers } from '../features/browsers/browsersSlice';
import { Tabs } from '../features/browsers/Tabs';
import { handleAutoplay } from '../features/embed/embedSlice';
import { ListPane } from '../features/lists/ListPane';
import { StatusBar } from '../features/status/StatusBar';
import { log } from '../main/helpers/console';

export const App = (): ReactElement => {
  const browsers = useSelector(selectBrowsers);
  const dispatch = useDispatch();
  const tabHeadings = browsers.map((browser) => browser.title);

  window.api.removeAllListeners('handle-autoplay');
  window.api.on('handle-autoplay', () => {
    log('dispatching handle-autoplay');
    dispatch(handleAutoplay());
  });

  return (
    <div className="flex flex-col flex-grow bg-primary-background">
      <div className="flex items-center justify-between flex-shrink-0 p-3 bg-indigo-200 border-b shadow-md header bg-header-5">
        <h1 className="text-3xl text-primary-text font-title" key="title">
          DJ Helper
        </h1>
      </div>
      <div className="flex flex-grow font-sans content">
        <div className="flex flex-col flex-grow-0 flex-shrink-0 w-1/3 p-2 section">
          <ListPane />
        </div>
        <div className="relative flex flex-col flex-grow flex-shrink-0 w-2/3 p-2 section -top-14">
          <div className="flex flex-col flex-grow">
            <Tabs headings={tabHeadings}>
              {browsers.map(
                (browser: Browser): ReactElement => (
                  <BrowserPane key={browser.id} browser={browser} />
                ),
              )}
            </Tabs>
          </div>
        </div>
        <StatusBar />
      </div>
    </div>
  );
};
