import React, { ReactElement } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Allotment } from 'allotment';
import { selectBrowsers } from '../features/browsers/browsersSlice';
import { Tabs } from '../features/browsers/Tabs';
import { handleAutoplay } from '../features/embed/embedSlice';
import { ListPane } from '../features/lists/ListPane';
import { StatusBar } from '../features/ui/StatusBar';
import { MetaPanel } from '../features/browsers/MetaPanel';
import { Browser } from '../common/types';
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
        <Allotment>
          <Allotment.Pane>
            <div className="p-2 section">
              <ListPane />
            </div>
          </Allotment.Pane>
          <Allotment.Pane>
            <Allotment vertical>
              <Allotment.Pane>
                <div className="p-2 section -top-14">
                  <Tabs headings={tabHeadings}>
                    {browsers.map(
                      (browser: Browser): ReactElement => (
                        <MetaPanel key={browser.id} browser={browser} />
                      ),
                    )}
                  </Tabs>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <div> </div>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
        <StatusBar />
      </div>
    </div>
  );
};
