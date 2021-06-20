import { ComponentData, ComponentHandlers } from '../../common/types';
import { createCtx } from '../helpers/contextHelper';

export type ComponentContext = {
  component: ComponentData;
  handlers: ComponentHandlers;
};

const [getContext, ComponentContextProvider] = createCtx<ComponentContext>();
export const getComponentContextProvider = (): typeof ComponentContextProvider => ComponentContextProvider;
export const getComponentContext = (): ComponentContext => getContext();
