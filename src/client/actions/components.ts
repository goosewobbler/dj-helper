import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';
import { showDialog } from './app';
import { ComponentState, Dispatch, AppState } from '../../common/types';
import { getApiPort } from '../helpers/apiPortHelper';

/* FETCH VERSIONS */

export const fetchVersions = (name: string): AnyAction => {
  const apiPort = getApiPort();
  const action = (): Promise<Response> =>
    fetch(`http://localhost:${apiPort}/api/component/${name}/versions`, { method: 'POST' });

  action.type = null;
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/start`, { method: 'POST' });
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/stop`, { method: 'POST' });
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/install`, { method: 'POST' });
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/build`, { method: 'POST' });
};

/* SET USE CACHE */

export const setUseCacheOnComponent = (
  name: string,
  value: boolean,
): ThunkAction<void, AppState, undefined, AnyAction> => (): void => {
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/cache/${value ? 'true' : 'false'}`, { method: 'POST' });
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/favourite/${favourite}`, { method: 'POST' });
};

/* PROMOTE & BUMP */

const promotingComponent = (name: string, environment: string): AnyAction => ({
  environment,
  name,
  type: 'PROMOTING_COMPONENT',
});

export const bumpComponent = (name: string, type: string): ThunkAction<void, AppState, undefined, AnyAction> => (
  dispatch: Dispatch,
): void => {
  dispatch(promotingComponent(name, 'int'));
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/bump/${type}`, { method: 'POST' }).then((): void => {
    dispatch(promotingComponent(name, null)); // TODO: why are we dispatching again here?
  });
};

export const promoteComponent = (
  name: string,
  environment: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch(promotingComponent(name, environment));
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/promote/${environment}`, { method: 'POST' });
};

/* OPEN IN CODE */

export const openInCode = (name: string): ThunkAction<void, AppState, undefined, AnyAction> => (): void => {
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/edit`, { method: 'POST' });
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
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/link/${dependency}`, { method: 'POST' });
};

export const unlinkComponent = (
  name: string,
  dependency: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  dispatch(linkingComponent(name, dependency));
  const apiPort = getApiPort();
  fetch(`http://localhost:${apiPort}/api/component/${name}/unlink/${dependency}`, { method: 'POST' });
};

/* UPDATING & SELECT */

export const updateAndSelectComponent = (name: string, noHistory?: boolean): AnyAction => {
  const action = (dispatch: Dispatch): void => {
    if (!noHistory && window.historyEnabled) {
      window.history.pushState({ name }, null, `/component/${name}`);
    }
    dispatch(fetchVersions(name));
    dispatch({
      name,
      type: 'SELECT_COMPONENT',
    });
  };

  action.type = null;
  return action;
};

/* CREATION & CLONING */

export const createComponent = (
  name: string,
  description: string,
  type: string,
  sourceComponent?: string,
): ThunkAction<void, AppState, undefined, AnyAction> => (dispatch: Dispatch): void => {
  let createUrl;

  if (sourceComponent) {
    dispatch(showDialog('clone', sourceComponent));
    const apiPort = getApiPort();
    createUrl = `http://localhost:${apiPort}/api/component/${sourceComponent}/clone`;
  } else {
    dispatch(showDialog('create'));
    const apiPort = getApiPort();
    createUrl = `http://localhost:${apiPort}/api/component/create/${type}`;
  }

  fetch(createUrl, {
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
  }).then((): void => {
    const fullName = `bbc-morph-${name}`;
    dispatch({
      name,
      fullName,
      type: 'CREATE_COMPONENT',
    });
    dispatch(updateAndSelectComponent(fullName));
    dispatch(installComponent(fullName));
  });
};
