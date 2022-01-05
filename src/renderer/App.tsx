import React, { ReactElement, useRef } from 'react';
import { SplitPane } from 'react-multi-split-pane';
import { selectActiveBrowser, selectBrowsers } from '../features/browsers/browsersSlice';
import { TabbedInterface } from '../features/browsers/Tabs';
import { handleAutoplay } from '../features/embed/embedSlice';
import { ListPane } from '../features/lists/ListPane';
import { StatusBar } from '../features/ui/StatusBar';
import { log } from '../main/helpers/console';
import {
  horizontalSplitterMoved,
  selectHorizontalSplitterDimensions,
  selectVerticalSplitterDimensions,
  verticalSplitterMoved,
} from '../features/ui/uiSlice';
import { useAppDispatch, useAppSelector } from '../common/hooks';

let previousCallTime = 0;

const debounce = (callback: () => Promise<unknown>) => {
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
  const browsers = useAppSelector(selectBrowsers);
  const { listPaneWidth, browserPaneWidth } = useAppSelector(selectHorizontalSplitterDimensions);
  const { metaPanelHeight, browserPanelHeight } = useAppSelector(selectVerticalSplitterDimensions);
  const dispatch = useAppDispatch();
  const listPane = useRef<HTMLDivElement>(null);
  const browserPane = useRef<HTMLDivElement>(null);
  const browserPanel = useRef<HTMLDivElement>(null);
  const metaPanel = useRef<HTMLDivElement>(null);
  const activeBrowser = useAppSelector(selectActiveBrowser());
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

  window.api.removeAllListeners('handle-autoplay');
  window.api.removeAllListeners('window-resized');
  window.api.on('handle-autoplay', () => {
    log('dispatching handle-autoplay');
    void dispatch(handleAutoplay());
  });
  window.api.on('window-resized', () => {
    const browserPanelHeightFromRef = browserPanel.current?.clientHeight;
    const browserPaneWidthFromRef = browserPane.current?.clientWidth;
    const listPaneWidthFromRef = listPane.current?.clientWidth;
    const metaPanelHeightFromRef = metaPanel.current?.clientHeight;
    dispatch(horizontalSplitterMoved([listPaneWidthFromRef, browserPaneWidthFromRef] as [number, number]));
    dispatch(verticalSplitterMoved([metaPanelHeightFromRef, browserPanelHeightFromRef] as [number, number]));
    void window.api.invoke('resize-browsers');
  });

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
          onChange={(sizes) =>
            debounce(() =>
              window.api.invoke('resize-browsers', {
                listPaneWidth: sizes[0],
                browserPaneWidth: sizes[1],
              }),
            )
          }
          onDragFinished={(sizes) => dispatch(horizontalSplitterMoved(sizes as [number, number]))}
        >
          <div className="flex flex-grow p-2 section" ref={listPane}>
            <ListPane />
          </div>

          <div className="flex flex-grow" ref={browserPane}>
            <SplitPane
              split="horizontal"
              defaultSizes={[metaPanelHeight, browserPanelHeight]}
              onChange={(sizes) =>
                debounce(() =>
                  window.api.invoke('resize-browsers', {
                    metaPanelHeight: sizes[0],
                    browserPanelHeight: sizes[1],
                  }),
                )
              }
              onDragFinished={(sizes) => dispatch(verticalSplitterMoved(sizes as [number, number]))}
            >
              <div className="w-full p-2 section" ref={metaPanel}>
                <TabbedInterface browsers={browsers} activeBrowser={activeBrowser} />
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
