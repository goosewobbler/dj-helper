import { createContext } from 'react';
import { Theme } from '../../common/types';

interface AppContext {
  apiPort: number;
  theme: Theme;
}

const context = createContext<AppContext | null>(null);
const AppContextProvider = context.Provider;
const AppContextConsumer = context.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer, context };
