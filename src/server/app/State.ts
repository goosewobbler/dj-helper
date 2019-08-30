import { System } from '../system';
import { StateValue } from '../../common/types';

interface State {
  retrieve(key: string): StateValue;
  store(key: string, value: StateValue): Promise<void>;
}

const createState = async (stateFilePath: string, system: System): Promise<State> => {
  let state: { [Key: string]: StateValue } = {};

  try {
    state = JSON.parse(await system.file.readFile(stateFilePath));
  } catch (ex) {
    // ignore
  }

  const retrieve = (key: string): StateValue => (key in state ? state[key] : null);

  const store = async (key: string, value: StateValue): Promise<void> => {
    if (value === null) {
      delete state[key];
    } else {
      state[key] = value;
    }
    await system.file.writeFile(stateFilePath, JSON.stringify(state, null, 2));
  };

  return {
    retrieve,
    store,
  };
};

export { createState, State, StateValue };
