import { ipcRenderer } from 'electron';
import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { showDialog } from './app';
import { ComponentState, Dispatch, AppState } from '../../common/types';

/* FETCH VERSIONS */

export const fetchVersions = (name: string): AnyAction => {
  const action = (): void => ipcRenderer.send('update-component-versions', name);

  action.type = '';
  return action;
};

/* START */

export const startComponent = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch({
    name,
    state: ComponentState.Starting,
    type: 'CHANGE_COMPONENT_STATE',
  });
  ipcRenderer.send('start-component', name);
};

/* STOP */

export const stopComponent = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch({
    name,
    state: ComponentState.Stopped,
    type: 'CHANGE_COMPONENT_STATE',
  });
  ipcRenderer.send('stop-component', name);
};

/* INSTALL */

export const installComponent = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch({
    name,
    state: ComponentState.Installing,
    type: 'CHANGE_COMPONENT_STATE',
  });
  ipcRenderer.send('install-component', name);
};

/* BUILD */

export const buildComponent = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch({
    name,
    state: ComponentState.Building,
    type: 'CHANGE_COMPONENT_STATE',
  });
  ipcRenderer.send('build-component', name);
};

/* SET USE CACHE */

export const setUseCacheOnComponent = (
  name: string,
  value: boolean,
): ThunkAction<void, AppState, undefined, AnyAction> => (): void => {
  ipcRenderer.send('cache-component', name, value);
};

/* FAVOURITE */

export const favouriteComponent = (
  name: string,
  favourite: boolean,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch({
    favourite,
    name,
    type: 'FAVOURITE_COMPONENT',
  });
  ipcRenderer.send('favourite-component', name, favourite);
};

/* PROMOTE & BUMP */

const promotingComponent = (name: string, environment: string | null): AnyAction => ({
  environment,
  name,
  type: 'PROMOTING_COMPONENT',
});

export const bumpComponent = (name: string, type: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch(promotingComponent(name, 'int'));
  ipcRenderer.once('component-bumped', () => dispatch(promotingComponent(name, null)));
  ipcRenderer.send('bump-component', name, type);
};

export const promoteComponent = (
  name: string,
  environment: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch(promotingComponent(name, environment));
  ipcRenderer.send('promote-component', name, environment);
};

/* OPEN IN CODE */

export const openInCode = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (): void => {
  ipcRenderer.send('edit-component', name);
};

/* LINKING */

const linkingComponent = (name: string, dependency: string): AnyAction => ({
  dependency,
  name,
  type: 'LINKING_COMPONENT',
});

export const linkComponent = (name: string, dependency: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch(linkingComponent(name, dependency));
  ipcRenderer.send('link-component', name, dependency);
};

export const unlinkComponent = (
  name: string,
  dependency: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch(linkingComponent(name, dependency));
  ipcRenderer.send('unlink-component', name, dependency);
};

/* UPDATING & SELECT */

export const updateAndSelectComponent = (name: string): AnyAction => {
  const action = (dispatch: Dispatch): void => {
    dispatch(fetchVersions(name));
    dispatch({
      name,
      type: 'SELECT_COMPONENT',
    });
  };

  action.type = '';
  return action;
}; // TODO: split into separate handlers

/* CREATION & CLONING */ export const createComponent = (
  name: string,
  description: string,
  type: string,
  sourceComponent?: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  const responseHandler = (): void => {
    const fullName = `bbc-morph-${name}`;
    dispatch({
      name,
      fullName,
      type: 'CREATE_COMPONENT',
    });
    dispatch(updateAndSelectComponent(fullName));
    dispatch(installComponent(fullName));
  };

  if (sourceComponent) {
    dispatch(showDialog('clone', sourceComponent));
    ipcRenderer.once('component-cloned', responseHandler);
    ipcRenderer.send('clone-component', sourceComponent, name, description);
  } else {
    dispatch(showDialog('create'));
    ipcRenderer.once('component-created', responseHandler);
    ipcRenderer.send('create-component', name, type, description);
  }
};
