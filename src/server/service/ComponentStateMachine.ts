import { ComponentActions } from './componentActions';
import { ComponentState } from '../../common/types';

const componentStateMachine = (actions: ComponentActions, onStateChanged: (state: ComponentState) => void) => {
  let currentState: ComponentState = ComponentState.Stopped;

  const getState = () => currentState;

  const changeState = async (newState: ComponentState) => {
    currentState = newState;
    await onStateChanged(newState);
  };

  const run = async () => {
    if (await actions.needsInstall()) {
      await changeState(ComponentState.Installing);
      await actions.install();
      await changeState(ComponentState.Building);
      await actions.buildAll();
      await changeState(ComponentState.Starting);
      await actions.run();
      await changeState(ComponentState.Running);
    } else {
      await changeState(ComponentState.Starting);
      await actions.run();
      await changeState(ComponentState.Running);
    }
  };

  const stop = async () => {
    await changeState(ComponentState.Stopped);
    await actions.stop();
  };

  const buildAll = async () => {
    await changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run(true);
    await changeState(ComponentState.Running);
  };

  const buildSass = async () => {
    await changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildSass();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const reinstall = async () => {
    await changeState(ComponentState.Installing);
    await actions.stop();
    await actions.uninstall();
    await actions.install();
    await changeState(ComponentState.Building);
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const link = async (dependency: string) => {
    await changeState(ComponentState.Linking);
    await actions.stop();
    await actions.makeOtherLinkable(dependency);
    await actions.link(dependency);
    await changeState(ComponentState.Building);
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const unlink = async (dependency: string) => {
    await changeState(ComponentState.Linking);
    await actions.stop();
    await actions.unlink(dependency);
    await changeState(ComponentState.Building);
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const makeLinkable = async () => {
    if (currentState === ComponentState.Stopped) {
      if (await actions.needsInstall()) {
        await changeState(ComponentState.Installing);
        await actions.install();
      }
      await changeState(ComponentState.Building);
      await actions.buildAll();
      await changeState(ComponentState.Stopped);
    }
  };

  const restart = async () => {
    await changeState(ComponentState.Stopped);
    await actions.stop();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  return {
    buildAll,
    buildSass,
    getState,
    link,
    makeLinkable,
    reinstall,
    restart,
    run,
    stop,
    unlink,
  };
};

export { componentStateMachine };
