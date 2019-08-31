import fs from 'fs-extra';
import { join } from 'path';

const getConfig = () => {
    const devMode = (await process.argv.slice(1)).indexOf('-D') !== -1;
    const currentWorkingDirectory = await process.cwd();
    const componentsDirectory = devMode ? join(currentWorkingDirectory, '../morph-modules') : currentWorkingDirectory;
    const configFilePath = join(componentsDirectory, 'morph-developer-console-config.json');
    let config;
    try {
        config = JSON.parse(fs.readFileSync(configFilePath));
    } catch (ex) {
        config = {};
    }
    return config;
}

export default getConfig;