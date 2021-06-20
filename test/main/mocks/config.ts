// const get = (key: string): StoredValue | null => store[key] || null;

// const set = async (key: string, value: StoredValue): Promise<void> => {
//   store[key] = value;
//   await system.file.writeFile(storeFilePath, JSON.stringify(store, null, 2));
// };

const get = jest.fn();
const set = jest.fn();

export default { get, set };
