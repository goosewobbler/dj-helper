import React, { ReactElement, useRef } from 'react';
import { SplitPane } from 'react-multi-split-pane';

import { TabbedInterface } from '../features/browsers/Tabs.js';
import { ListPane } from '../features/lists/ListPane.jsx';
import { StatusBar } from '../features/ui/StatusBar.jsx';
import { log } from '../main/helpers/console.js';
import { selectHorizontalSplitterDimensions, selectVerticalSplitterDimensions } from '../features/ui/index.js';
import { useDispatch } from './hooks/useDispatch.js';
import { useStore } from './hooks/useStore.js';

let previousCallTime = 0;

const debounce = (callback: () => void) => {
  const timeout = 5;
  const callTime = Date.now();

  log('debounce yo', callTime, previousCallTime);

  // return () => {
  if (previousCallTime === 0 || callTime - previousCallTime > timeout) {
    log('debounce calling callback', callTime, previousCallTime);
    previousCallTime = callTime;
    void callback();
  }
  // };
};

export const App = (): ReactElement => {
  const { listPaneWidth, browserPaneWidth } = useStore(selectHorizontalSplitterDimensions);
  const { metaPanelHeight, browserPanelHeight } = useStore(selectVerticalSplitterDimensions);
  const dispatch = useDispatch();
  const listPane = useRef<HTMLDivElement>(null);
  const browserPane = useRef<HTMLDivElement>(null);
  const browserPanel = useRef<HTMLDivElement>(null);
  const metaPanel = useRef<HTMLDivElement>(null);
  // const [cachedActiveBrowser, setCachedActiveBrowser] = useState(activeBrowser);
  // const [cachedBrowsers, setCachedBrowsers] = useState(browsers);

  // log('app render', activeBrowser, cachedActiveBrowser);
  // if (activeBrowser && activeBrowser.id !== cachedActiveBrowser.id) {
  //   log('updating tabs activeBrowser', activeBrowser.id);
  //   setCachedActiveBrowser(activeBrowser);
  // }
  // if (cachedBrowsers.length !== browsers.length) {
  //   setCachedBrowsers(browsers);
  // }
  // const displayTabs = useMemo(
  //   () => <Tabs browsers={browsers} activeBrowser={cachedActiveBrowser} />,
  //   [browsers, cachedActiveBrowser],
  // );

  // window.api.on('window-resized', () => {
  //   const browserPanelHeightFromRef = browserPanel.current?.clientHeight;
  //   const browserPaneWidthFromRef = browserPane.current?.clientWidth;
  //   const listPaneWidthFromRef = listPane.current?.clientWidth;
  //   const metaPanelHeightFromRef = metaPanel.current?.clientHeight;
  //   dispatch('UI:HORIZONTAL_SPLITTER_MOVED', [listPaneWidthFromRef, browserPaneWidthFromRef]);
  //   dispatch('UI:VERTICAL_SPLITTER_MOVED', [metaPanelHeightFromRef, browserPanelHeightFromRef]);
  // });

  return (
    <div className="flex flex-col flex-grow bg-primary-background">
      <div className="flex items-center justify-between flex-shrink-0 p-3 bg-indigo-200 border-b shadow-md header bg-header-5">
        <h1 className="text-3xl text-primary-text font-title" key="title">
          DJ Helper
        </h1>
      </div>
      <div className="flex flex-grow font-sans content">
        <SplitPane
          split="vertical"
          defaultSizes={[listPaneWidth, browserPaneWidth]}
          onChange={(sizes) => debounce(() => dispatch('UI:HORIZONTAL_SPLITTER_MOVED', sizes))}
          onDragFinished={(sizes) => dispatch('UI:HORIZONTAL_SPLITTER_MOVED', sizes)}
        >
          <div className="flex flex-grow p-2 section" ref={listPane}>
            <ListPane />
          </div>

          <div className="flex flex-grow" ref={browserPane}>
            <SplitPane
              split="horizontal"
              defaultSizes={[metaPanelHeight, browserPanelHeight]}
              onChange={(sizes) => debounce(() => dispatch('UI:VERTICAL_SPLITTER_MOVED', sizes))}
              onDragFinished={(sizes) => dispatch('UI:VERTICAL_SPLITTER_MOVED', sizes)}
            >
              <div className="w-full p-2 section" ref={metaPanel}>
                <TabbedInterface />
              </div>
              <div className="flex flex-grow" ref={browserPanel} />
            </SplitPane>
          </div>
        </SplitPane>
        <StatusBar />
      </div>
    </div>
  );
};
