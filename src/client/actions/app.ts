import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { ComponentData, Dispatch, AppState } from '../../common/types';

export const updateAvailable = (): AnyAction => ({
  type: 'UPDATE_AVAILABLE',
});

export const updating = (): AnyAction => ({
  type: 'UPDATING',
});

export const updated = (): AnyAction => ({
  type: 'UPDATED',
});

export const update = (): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch(updating());
  fetch(`http://localhost:3333/api/update`, { method: 'POST' });
};

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

export const hideDialog = (name: string): AnyAction => ({
  name,
  type: 'HIDE_DIALOG',
});

export const filterComponents = (filter: string): AnyAction => ({
  filter,
  type: 'FILTER_COMPONENTS',
});
