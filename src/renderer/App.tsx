import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Browser } from '../common/types';
import { BrowserPane } from '../features/browser/BrowserPane';
import { selectBrowser } from '../features/browser/browserSlice';
import { Tabs } from '../features/browser/Tabs';
import { ListPane } from '../features/lists/ListPane';

export const App = (): ReactElement => {
  const browsers = useSelector(selectBrowser);
  const tabHeadings = browsers.map((browser) => browser.title);
  return (
    <div className="flex flex-col flex-grow bg-primary-background">
      <div className="flex items-center justify-between flex-shrink-0 p-3 border-b shadow-md header bg-header-5">
        <h1 className="text-3xl text-primary-text" key="title">
          DJ Helper
        </h1>
      </div>
      <div className="flex flex-grow content">
        <div className="flex flex-col flex-grow-0 flex-shrink-0 w-1/3 p-2 section">
          <ListPane />
        </div>
        <div className="flex flex-col flex-grow flex-shrink-0 w-2/3 p-2 section">
          <div className="flex flex-col flex-grow">
            <Tabs headings={tabHeadings}>
              {browsers.map(
                (browser: Browser): ReactElement => (
                  <BrowserPane browser={browser} />
                ),
              )}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
