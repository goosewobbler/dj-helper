import { startsWith } from 'lodash/fp';

import IConfig from '../types/IConfig';
import ISystem from '../types/ISystem';

const Config = async (configFilePath: string, system: ISystem): Promise<IConfig> => {
  let config: { [Key: string]: any } = {};

  try {
    config = JSON.parse(await system.file.readFile(configFilePath));
  } catch (ex) {
    // ignore
  }

  (await system.process.getCommandLineArgs()).forEach(arg => {
    if (startsWith('--feature=', arg)) {
      config.features = config.features || {};
      const feature = arg.substr(10);
      config.features[feature] = true;
    }
  });

  const isFeatureEnabled = (feature: string) => config.features[feature] || false;

  const getValue = (name: string) => (name in config ? config[name] : null);

  const setValue = async (name: string, value: any) => {
    config[name] = value;
    await system.file.writeFile(configFilePath, JSON.stringify(config, null, 2));
  };

  return {
    getValue,
    isFeatureEnabled,
    setValue,
  };
};

export default Config;
