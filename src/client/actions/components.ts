import { ComponentState, ComponentData } from '../../common/types';

export const receiveComponents = (components: ComponentData[]) => ({
  components,
  type: 'RECEIVE_COMPONENTS',
});

export const receiveComponent = (component: ComponentData) => ({
  component,
  type: 'RECEIVE_COMPONENT',
});

export const receiveEditors = (editors: string[]) => ({
  editors,
  type: 'RECEIVE_EDITORS',
});

export const selectComponent = (name: string) => ({
  name,
  type: 'SELECT_COMPONENT',
});

export const promotingComponent = (name: string, environment: string) => ({
  environment,
  name,
  type: 'PROMOTING_COMPONENT',
});

export const fetchVersions = (name: string) => {
  const action = (() => {
    return fetch(`http://localhost:3333/api/component/${name}/versions`, { method: 'POST' });
  }) as any;

  action.type = null;
  return action;
};

export const updateAndSelectComponent = (name: string, noHistory?: boolean) => {
  const action = ((dispatch: any) => {
    if (!noHistory && (window as any).historyEnabled) {
      window.history.pushState({ name }, null, `/component/${name}`);
    }
    dispatch(fetchVersions(name));
    dispatch(selectComponent(name));
  }) as any;

  action.type = null;
  return action;
};

export const startingComponent = (name: string) => ({
  name,
  state: ComponentState.Starting,
  type: 'CHANGE_COMPONENT_STATE',
});

export const stoppingComponent = (name: string) => ({
  name,
  state: ComponentState.Stopped,
  type: 'CHANGE_COMPONENT_STATE',
});

export const installingComponent = (name: string) => ({
  name,
  state: ComponentState.Installing,
  type: 'CHANGE_COMPONENT_STATE',
});

export const buildingComponent = (name: string) => ({
  name,
  state: ComponentState.Building,
  type: 'CHANGE_COMPONENT_STATE',
});

export const linkingComponent = (name: string, dependency: string) => ({
  dependency,
  name,
  type: 'LINKING_COMPONENT',
});

export const filterComponents = (filter: string) => ({
  filter,
  type: 'FILTER_COMPONENTS',
});

export const startComponent = (name: string) => (dispatch: any) => {
  dispatch(startingComponent(name));
  fetch(`http://localhost:3333/api/component/${name}/start`, { method: 'POST' });
};

export const stopComponent = (name: string) => (dispatch: any) => {
  dispatch(stoppingComponent(name));
  fetch(`http://localhost:3333/api/component/${name}/stop`, { method: 'POST' });
};

export const installComponent = (name: string) => (dispatch: any) => {
  dispatch(installingComponent(name));
  fetch(`http://localhost:3333/api/component/${name}/install`, { method: 'POST' });
};

export const buildComponent = (name: string) => (dispatch: any) => {
  dispatch(buildingComponent(name));
  fetch(`http://localhost:3333/api/component/${name}/build`, { method: 'POST' });
};

export const setUseCacheOnComponent = (name: string, value: boolean) => (dispatch: any) => {
  fetch(`http://localhost:3333/api/component/${name}/cache/${value ? 'true' : 'false'}`, { method: 'POST' });
};

export const favouriteComponent = (name: string, favourite: boolean) => (dispatch: any) => {
  dispatch({
    favourite,
    name,
    type: 'FAVOURITE_COMPONENT',
  });
  fetch(`http://localhost:3333/api/component/${name}/favourite/${favourite}`, { method: 'POST' });
};

export const bumpComponent = (name: string, type: string) => (dispatch: any) => {
  dispatch(promotingComponent(name, 'int'));
  fetch(`http://localhost:3333/api/component/${name}/bump/${type}`, { method: 'POST' }).then(response => {
    dispatch(promotingComponent(name, null));
  });
};

export const promoteComponent = (name: string, environment: string) => (dispatch: any) => {
  dispatch(promotingComponent(name, environment));
  fetch(`http://localhost:3333/api/component/${name}/promote/${environment}`, { method: 'POST' });
};

export const openInCode = (name: string) => (dispatch: any) => {
  fetch(`http://localhost:3333/api/component/${name}/edit`, { method: 'POST' });
};

export const linkComponent = (name: string, dependency: string) => (dispatch: any) => {
  dispatch(linkingComponent(name, dependency));
  fetch(`http://localhost:3333/api/component/${name}/link/${dependency}`, { method: 'POST' });
};

export const unlinkComponent = (name: string, dependency: string) => (dispatch: any) => {
  dispatch(linkingComponent(name, dependency));
  fetch(`http://localhost:3333/api/component/${name}/unlink/${dependency}`, { method: 'POST' });
};

export const updateAvailable = () => ({
  type: 'UPDATE_AVAILABLE',
});

export const updating = () => ({
  type: 'UPDATING',
});

export const updated = () => ({
  type: 'UPDATED',
});

export const update = () => (dispatch: any) => {
  dispatch(updating());
  fetch(`http://localhost:3333/api/update`, { method: 'POST' });
};

export const showCloneDialog = (name: string) => ({
  name,
  type: 'SHOW_CLONE_DIALOG',
});

export const showCreateDialog = (show: boolean) => ({
  show,
  type: 'SHOW_CREATE_DIALOG',
});

export const createComponent = (name: string, displayName: string) => ({
  displayName,
  name,
  type: 'CREATE_COMPONENT',
});

export const createModule = (name: string, description: string, type: string) => (dispatch: any) => {
  dispatch(showCreateDialog(false));
  fetch(`http://localhost:3333/api/component/create/${type}`, {
    body: JSON.stringify({ name, description }),
    headers: {
      'Content-Type': 'application/json',
    } as any,
    method: 'POST',
  }).then(() => {
    const fullName = `bbc-morph-${name}`;
    dispatch(createComponent(fullName, name));
    dispatch(updateAndSelectComponent(fullName));
    dispatch(installComponent(fullName));
  });
};

export const cloneComponent = (name: string, createName: string, description: string) => (dispatch: any) => {
  dispatch(showCloneDialog(null));
  fetch(`http://localhost:3333/api/component/${name}/clone`, {
    body: JSON.stringify({ name: createName, description }),
    headers: {
      'Content-Type': 'application/json',
    } as any,
    method: 'POST',
  }).then(() => {
    const fullName = `bbc-morph-${createName}`;
    dispatch(createComponent(fullName, createName));
    dispatch(updateAndSelectComponent(fullName));
    dispatch(installComponent(fullName));
  });
};
