import { System } from '../system';

type configValue = string | number | boolean;

interface ConfigStore {
  [Key: string]: configValue;
}

interface Config {
  getValue(name: string): ConfigStore[string];
  setValue(name: string, value: configValue): Promise<void>;
}

const createConfig = async (configFilePath: string, system: System): Promise<Config> => {
  let config: ConfigStore = {};

  try {
    config = JSON.parse(await system.file.readFile(configFilePath));
  } catch (ex) {
    // ignore
  }

  const getValue = (name: string): ConfigStore[string] => config[name] || null;

  const setValue = async (name: string, value: ConfigStore[string]): Promise<void> => {
    config[name] = value;
    await system.file.writeFile(configFilePath, JSON.stringify(config, null, 2));
  };

  return {
    getValue,
    setValue,
  };
};

export { createConfig, Config, configValue };
