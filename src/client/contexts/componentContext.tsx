import * as React from 'react';
import { ComponentData } from '../../common/types';

interface ComponentHandlers {
  onOpenInCode(name: string): any;
  onBuild(name: string): any;
  onInstall(name: string): any;
  onSetUseCache(name: string, value: boolean): any;
  onBumpComponent(name: string, type: string): any;
  onPromoteComponent(name: string, environment: string): any;
  onSelectComponent(name: string): any;
  onLinkComponent(name: string, dependency: string): any;
  onUnlinkComponent(name: string, dependency: string): any;
}

interface ComponentContext {
  component: ComponentData;
  handlers: ComponentHandlers;
}

const context = React.createContext<ComponentContext | null>(null);
const ComponentContextProvider = context.Provider;
const ComponentContextConsumer = context.Consumer;

export { ComponentContext, ComponentContextProvider, ComponentContextConsumer, ComponentHandlers, context };
