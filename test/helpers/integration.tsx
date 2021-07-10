import React, { FunctionComponent, ReactNode, ReactElement } from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from '../../src/features/rootReducer';
import { AppState } from '../../src/common/types';

function buildWrapper(store: EnhancedStore): FunctionComponent<{}> {
  return function Wrapper({ children }: { children?: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

type ConfigOptions = { preloadedState?: AppState; store?: EnhancedStore };

function render(ui: ReactElement, { preloadedState, store, ...renderOptions }: ConfigOptions = {}) {
  store = configureStore({ reducer: rootReducer, preloadedState });
  return rtlRender(ui, { wrapper: buildWrapper(store), ...renderOptions });
}

export * from '@testing-library/react';
export { render };
