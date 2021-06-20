import { System, StoredValue, ValueStore, Store } from '../../common/types';

const createStore = async (storeFilePath: string, system: System): Promise<Store> => {
  let store: ValueStore = {};

  try {
    store = JSON.parse(await system.file.readFile(storeFilePath)) as ValueStore;
  } catch (ex) {
    // ignore
  }

  const get = (key: string): StoredValue | null => store[key] || null;

  const set = async (key: string, value: StoredValue): Promise<void> => {
    store[key] = value;
    await system.file.writeFile(storeFilePath, JSON.stringify(store, null, 2));
  };

  return {
    get,
    set,
  };
};

export default createStore;
