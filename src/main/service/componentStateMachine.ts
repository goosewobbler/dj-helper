import { ComponentActions } from './componentActions';
import { ComponentState } from '../../common/types';

interface ComponentStateMachine {
  buildAll: () => Promise<void>;
  buildSass: () => Promise<void>;
  getState: () => number;
  link: (dependency: string) => Promise<void>;
  makeLinkable: () => Promise<void>;
  reinstall: () => Promise<void>;
  restart: () => Promise<void>;
  run: () => Promise<void>;
  stop: () => Promise<void>;
  unlink: (dependency: string) => Promise<void>;
}

const componentStateMachine = (
  actions: ComponentActions,
  onStateChanged: (state: ComponentState) => void,
): ComponentStateMachine => {
  let currentState: ComponentState = ComponentState.Stopped;

  const getState = (): number => currentState;

  const changeState = async (newState: ComponentState): Promise<void> => {
    currentState = newState;
    await onStateChanged(newState);
  };

  const run = async (): Promise<void> => {
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

  const stop = async (): Promise<void> => {
    await changeState(ComponentState.Stopped);
    await actions.stop();
  };

  const buildAll = async (): Promise<void> => {
    await changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run(true);
    await changeState(ComponentState.Running);
  };

  const buildSass = async (): Promise<void> => {
    await changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildSass();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const reinstall = async (): Promise<void> => {
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

  const link = async (dependency: string): Promise<void> => {
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

  const unlink = async (dependency: string): Promise<void> => {
    await changeState(ComponentState.Linking);
    await actions.stop();
    await actions.unlink(dependency);
    await changeState(ComponentState.Building);
    await actions.buildAll();
    await changeState(ComponentState.Starting);
    await actions.run();
    await changeState(ComponentState.Running);
  };

  const makeLinkable = async (): Promise<void> => {
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

  const restart = async (): Promise<void> => {
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

export default componentStateMachine;
