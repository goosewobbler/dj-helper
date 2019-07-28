import * as React from 'react';
import ComponentHandlers from '../types/ComponentHandlers';
import ComponentData from '../../types/IComponentData';

interface ComponentContext {
  component: ComponentData;
  handlers: ComponentHandlers;
}

const context = React.createContext<ComponentContext | null>(null);
const ComponentContextProvider = context.Provider;
const ComponentContextConsumer = context.Consumer;

export { ComponentContext, ComponentContextProvider, ComponentContextConsumer, context };
