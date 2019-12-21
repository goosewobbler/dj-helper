import ComponentStateMachine from '../../../src/server/service/ComponentStateMachine';
import IComponentActions from '../../../src/server/service/types/IComponentActions';
import ComponentState from '../../../src/types/ComponentState';

const createMockActions = (): IComponentActions => ({
  buildAll: jest.fn().mockReturnValue(Promise.resolve()),
  buildSass: jest.fn().mockReturnValue(Promise.resolve()),
  install: jest.fn().mockReturnValue(Promise.resolve()),
  link: jest.fn().mockReturnValue(Promise.resolve()),
  makeOtherLinkable: jest.fn().mockReturnValue(Promise.resolve()),
  needsInstall: jest.fn().mockReturnValue(Promise.resolve(false)),
  run: jest.fn().mockReturnValue(Promise.resolve()),
  stop: jest.fn().mockReturnValue(Promise.resolve()),
  uninstall: jest.fn().mockReturnValue(Promise.resolve()),
  unlink: jest.fn().mockReturnValue(Promise.resolve()),
});

test('can run from stopped without setup', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.run();

  expect(onStateChanged).toHaveBeenCalledTimes(2);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.run).toHaveBeenCalledTimes(1);
});

test('can run from stopped with setup', async () => {
  const actions = createMockActions();
  actions.needsInstall = jest.fn().mockReturnValue(true);
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.run();

  expect(onStateChanged).toHaveBeenCalledTimes(4);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Installing);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.install).toHaveBeenCalledTimes(1);
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can stop from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.stop();

  expect(onStateChanged).toHaveBeenCalledTimes(1);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Stopped);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Stopped);
});

test('can restart from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.restart();

  expect(onStateChanged).toHaveBeenCalledTimes(3);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Stopped);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can build all from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.buildAll();

  expect(onStateChanged).toHaveBeenCalledTimes(3);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can build sass from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.buildSass();

  expect(onStateChanged).toHaveBeenCalledTimes(3);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.buildSass).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can reinstall from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.reinstall();

  expect(onStateChanged).toHaveBeenCalledTimes(4);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Installing);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.uninstall).toHaveBeenCalledTimes(1);
  expect(actions.install).toHaveBeenCalledTimes(1);
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can link from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.link('bbc-morph-foo');

  expect(onStateChanged).toHaveBeenCalledTimes(4);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Linking);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.makeOtherLinkable).toHaveBeenCalledTimes(1);
  expect(actions.makeOtherLinkable).toHaveBeenCalledWith('bbc-morph-foo');
  expect(actions.link).toHaveBeenCalledTimes(1);
  expect(actions.link).toHaveBeenCalledWith('bbc-morph-foo');
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can unlink from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.unlink('bbc-morph-foo');

  expect(onStateChanged).toHaveBeenCalledTimes(4);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Linking);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.stop).toHaveBeenCalledTimes(1);
  expect(actions.unlink).toHaveBeenCalledTimes(1);
  expect(actions.unlink).toHaveBeenCalledWith('bbc-morph-foo');
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});

test('can make linkable from stopped when install NOT needed', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.makeLinkable();

  expect(onStateChanged).toHaveBeenCalledTimes(2);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Stopped);
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Stopped);
});

test('can make linkable from stopped when install needed', async () => {
  const actions = createMockActions();
  actions.needsInstall = jest.fn().mockReturnValue(true);
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.makeLinkable();

  expect(onStateChanged).toHaveBeenCalledTimes(3);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Installing);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Building);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Stopped);
  expect(actions.install).toHaveBeenCalledTimes(1);
  expect(actions.buildAll).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Stopped);
});

test('can make linkable from running', async () => {
  const actions = createMockActions();
  const onStateChanged = jest.fn();
  const componentStateMachine = ComponentStateMachine(actions, onStateChanged);
  await componentStateMachine.run();
  await componentStateMachine.makeLinkable();

  expect(onStateChanged).toHaveBeenCalledTimes(2);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Starting);
  expect(onStateChanged).toHaveBeenCalledWith(ComponentState.Running);
  expect(actions.run).toHaveBeenCalledTimes(1);
  expect(componentStateMachine.getState()).toBe(ComponentState.Running);
});
