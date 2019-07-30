import { join } from 'path';
import { ModuleType } from '../../common/types';
import { System } from '../system';

const createTypeDirectories = {
  [ModuleType.Data]: 'data',
  [ModuleType.View]: 'view',
  [ModuleType.ViewCSS]: 'viewcss',
};

const createComponentFiles = async (
  system: System,
  name: string,
  type: ModuleType,
  createOptions: { description: string },
) => {
  const packageName = `bbc-morph-${name}`;
  const typeDirectory = createTypeDirectories[type];
  const fromDirectory = join(__dirname, `../../../../templates/${typeDirectory}`);
  const toDirectory = join(await system.process.getCurrentWorkingDirectory(), name);
  await system.file.copyDirectory(fromDirectory, toDirectory, false);

  const packageJSONPath = join(toDirectory, 'package.json');
  const packageJSON = JSON.parse(await system.file.readFile(packageJSONPath));
  packageJSON.name = packageName;
  packageJSON.description = createOptions.description;
  packageJSON.homepage = `http://github.com/bbc/morph-modules/tree/master/${name}`;
  await system.file.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  const readmePath = join(toDirectory, 'README.md');
  const readme = `# ${name}\n\n${createOptions.description}\n`;
  await system.file.writeFile(readmePath, readme);

  try {
    const featureFilePath = join(toDirectory, 'test/multi-tier/index.feature');
    const featureFile = await system.file.readFile(featureFilePath);
    const newFeatureFile = featureFile.replace('bbc-morph-example', packageName);
    await system.file.writeFile(featureFilePath, newFeatureFile);
  } catch (ex) {
    // ignore
  }

  const npmIgnorePath = join(toDirectory, '.npmignore');
  const gitIgnorePath = join(toDirectory, '.gitignore');
  await system.file.moveDirectory(npmIgnorePath, gitIgnorePath);
};

export { createComponentFiles };
