import { AnyAction } from 'redux';
import { ComponentData } from '../../common/types';

export const receiveComponents = (components: ComponentData[]): AnyAction => ({
  components,
  type: 'RECEIVE_COMPONENTS',
});

export const receiveComponent = (component: ComponentData): AnyAction => ({
  component,
  type: 'RECEIVE_COMPONENT',
});

export const receiveEditors = (editors: string[]): AnyAction => ({
  editors,
  type: 'RECEIVE_EDITORS',
});

export const showDialog = (name: string, componentToClone?: string): AnyAction => ({
  name,
  componentToClone,
  type: 'SHOW_DIALOG',
});

export const hideDialog = (): AnyAction => ({
  type: 'HIDE_DIALOG',
});

export const filterComponents = (filter: string): AnyAction => ({
  filter,
  type: 'FILTER_COMPONENTS',
});
