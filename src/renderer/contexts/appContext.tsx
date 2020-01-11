import { createContext } from 'react';

interface AppContext {
  componentPort: number;
}

const context = createContext<AppContext | null>(null);
const AppContextProvider = context.Provider;
const AppContextConsumer = context.Consumer;

export { AppContext, AppContextProvider, AppContextConsumer, context };
