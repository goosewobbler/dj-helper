import State from '../types/State';
import System from '../types/System';

const createState = async (stateFilePath: string, system: System): Promise<State> => {
  let state: { [Key: string]: any } = {};

  try {
    state = JSON.parse(await system.file.readFile(stateFilePath));
  } catch (ex) {
    // ignore
  }

  const retrieve = (key: string) => (key in state ? state[key] : null);

  const store = async (key: string, value: any) => {
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

export default createState;
