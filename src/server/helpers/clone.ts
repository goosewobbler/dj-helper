import { join } from 'path';
import { System } from '../system';

const cloneComponent = async (
  system: System,
  path: string,
  name: string,
  clonePath: string,
  cloneOptions: { description: string },
): Promise<void> => {
  const packageName = `bbc-morph-${name}`;

  await system.file.copyDirectory(path, clonePath, true);

  const packageJSONPath = join(clonePath, 'package.json');
  const packageJSON = JSON.parse(await system.file.readFile(packageJSONPath));
  packageJSON.name = packageName;
  packageJSON.description = cloneOptions.description;
  packageJSON.homepage = `http://github.com/bbc/morph-modules/tree/master/${name}`;
  await system.file.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  const readmePath = join(clonePath, 'README.md');
  const readme = `# ${name}\n\n${cloneOptions.description}\n`;
  await system.file.writeFile(readmePath, readme);
};

export default cloneComponent;
