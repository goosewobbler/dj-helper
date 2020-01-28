// const get = (key: string): storedValue | null => store[key] || null;

// const set = async (key: string, value: storedValue): Promise<void> => {
//   store[key] = value;
//   await system.file.writeFile(storeFilePath, JSON.stringify(store, null, 2));
// };

const get = jest.fn();
const set = jest.fn();

export default { get, set };
