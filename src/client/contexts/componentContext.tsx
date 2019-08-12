import * as React from 'react';
import { ComponentData } from '../../common/types';

interface ComponentHandlers {
  onOpenInCode(name: string): void;
  onBuild(name: string): void;
  onInstall(name: string): void;
  onSetUseCache(name: string, value: boolean): void;
  onBumpComponent(name: string, type: string): void;
  onPromoteComponent(name: string, environment: string): void;
  onSelectComponent(name: string): void;
  onLinkComponent(name: string, dependency: string): void;
  onUnlinkComponent(name: string, dependency: string): void;
}

interface ComponentContext {
  component: ComponentData;
  handlers: ComponentHandlers;
}

const context = React.createContext<ComponentContext | null>(null);
const ComponentContextProvider = context.Provider;
const ComponentContextConsumer = context.Consumer;

export { ComponentContext, ComponentContextProvider, ComponentContextConsumer, ComponentHandlers, context };
