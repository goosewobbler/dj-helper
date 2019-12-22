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

  const changeState = (newState: ComponentState): void => {
    currentState = newState;
    onStateChanged(newState);
  };

  const run = async (): Promise<void> => {
    if (await actions.needsInstall()) {
      changeState(ComponentState.Installing);
      await actions.install();
      changeState(ComponentState.Building);
      await actions.buildAll();
      changeState(ComponentState.Starting);
      await actions.run();
      changeState(ComponentState.Running);
    } else {
      changeState(ComponentState.Starting);
      await actions.run();
      changeState(ComponentState.Running);
    }
  };

  const stop = async (): Promise<void> => {
    changeState(ComponentState.Stopped);
    await actions.stop();
  };

  const buildAll = async (): Promise<void> => {
    changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildAll();
    changeState(ComponentState.Starting);
    await actions.run(true);
    changeState(ComponentState.Running);
  };

  const buildSass = async (): Promise<void> => {
    changeState(ComponentState.Building);
    await actions.stop();
    await actions.buildSass();
    changeState(ComponentState.Starting);
    await actions.run();
    changeState(ComponentState.Running);
  };

  const reinstall = async (): Promise<void> => {
    changeState(ComponentState.Installing);
    await actions.stop();
    actions.uninstall();
    await actions.install();
    changeState(ComponentState.Building);
    await actions.buildAll();
    changeState(ComponentState.Starting);
    await actions.run();
    changeState(ComponentState.Running);
  };

  const link = async (dependency: string): Promise<void> => {
    changeState(ComponentState.Linking);
    await actions.stop();
    await actions.makeOtherLinkable(dependency);
    actions.link(dependency);
    changeState(ComponentState.Building);
    await actions.buildAll();
    changeState(ComponentState.Starting);
    await actions.run();
    changeState(ComponentState.Running);
  };

  const unlink = async (dependency: string): Promise<void> => {
    changeState(ComponentState.Linking);
    await actions.stop();
    actions.unlink(dependency);
    changeState(ComponentState.Building);
    await actions.buildAll();
    changeState(ComponentState.Starting);
    await actions.run();
    changeState(ComponentState.Running);
  };

  const makeLinkable = async (): Promise<void> => {
    if (currentState === ComponentState.Stopped) {
      if (await actions.needsInstall()) {
        changeState(ComponentState.Installing);
        await actions.install();
      }
      changeState(ComponentState.Building);
      await actions.buildAll();
      changeState(ComponentState.Stopped);
    }
  };

  const restart = async (): Promise<void> => {
    changeState(ComponentState.Stopped);
    await actions.stop();
    changeState(ComponentState.Starting);
    await actions.run();
    changeState(ComponentState.Running);
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
