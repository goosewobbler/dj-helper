import React, { ComponentType, ReactNode, ReactElement } from 'react';
import { render as rtlRender, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { rootReducer } from '../../src/features/rootReducer';
import { AppState } from '../../src/common/types';

function buildWrapper(store: EnhancedStore): ComponentType {
  return function Wrapper({ children }: { children?: ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  };
}

type ConfigOptions = { preloadedState?: AppState; store?: EnhancedStore };

function render(ui: ReactElement, { preloadedState, ...renderOptions }: ConfigOptions = {}): RenderResult {
  const store = configureStore({ reducer: rootReducer, preloadedState });
  return rtlRender(ui, { wrapper: buildWrapper(store), ...renderOptions });
}

export * from '@testing-library/react';
export { userEvent, render };
