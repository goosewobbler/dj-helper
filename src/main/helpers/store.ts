import { System, storedValue, ValueStore, Store } from '../../common/types';

const createStore = async (storeFilePath: string, system: System): Promise<Store> => {
  let store: ValueStore = {};

  try {
    store = JSON.parse(await system.file.readFile(storeFilePath));
  } catch (ex) {
    // ignore
  }

  const get = (key: string): storedValue | null => store[key] || null;

  const set = async (key: string, value: storedValue): Promise<void> => {
    store[key] = value;
    await system.file.writeFile(storeFilePath, JSON.stringify(store, null, 2));
  };

  return {
    get,
    set,
  };
};

export default createStore;
