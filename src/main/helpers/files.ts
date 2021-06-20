import { join } from 'path';
import { emptyDirSync, readFileSync } from 'fs-extra';
import * as tar from 'tar';

import runNpm from './npm';
import { ModuleType, System, StringObject, Package, Shrinkwrap } from '../../common/types';

const cloneComponentFiles = async (
  system: System,
  path: string,
  name: string,
  clonePath: string,
  cloneOptions: { description: string },
): Promise<void> => {
  const packageName = `bbc-morph-${name}`;

  await system.file.copyDirectory(path, clonePath, true);

  const packageJSONPath = join(clonePath, 'package.json');
  const packageJSON = JSON.parse(await system.file.readFile(packageJSONPath)) as StringObject;
  packageJSON.name = packageName;
  packageJSON.description = cloneOptions.description;
  packageJSON.homepage = `http://github.com/bbc/morph-modules/tree/master/${name}`;
  await system.file.writeFile(packageJSONPath, JSON.stringify(packageJSON, null, 2));

  const readmePath = join(clonePath, 'README.md');
  const readme = `# ${name}\n\n${cloneOptions.description}\n`;
  await system.file.writeFile(readmePath, readme);
};

const extract = (directory: string, tarballName: string, file: string): Promise<string> =>
  new Promise((resolve, reject): void => {
    const tarballPath = join(directory, tarballName);

    tar.extract(
      {
        cwd: directory,
        file: tarballPath,
      },
      [file],
      (error): void => {
        if (error) {
          reject(error);
        } else {
          const extractedPath = join(directory, file);
          try {
            const contents = readFileSync(extractedPath, 'utf-8');
            resolve(contents);
          } catch (readError) {
            reject(readError);
          }
        }
      },
    );
  });

const pack = async (directory: string, packageName: string): Promise<string> => {
  let output = '';
  await runNpm(
    directory,
    ['pack', packageName],
    (message: string): void => {
      output = message.toString().trim();
    },
    (): null => null,
  );
  return output;
};

const getVersions = (raw: string): StringObject => {
  const shrinkwrap = JSON.parse(raw) as Shrinkwrap;
  const has: StringObject = {};
  Object.entries(shrinkwrap.dependencies).forEach(([dependencyName, dependency]: [string, StringObject]): void => {
    has[dependencyName] = dependency.version;
  });
  return has;
};

const getShrinkwrap = async (packageName: string): Promise<{ [Key: string]: string }> => {
  try {
    const directory = '/tmp/morph-dependencies';
    emptyDirSync(directory);
    const tarballName = await pack(directory, packageName);
    const raw = await extract(directory, tarballName, 'package/npm-shrinkwrap.json');
    return getVersions(raw);
  } catch (ex) {
    // ignore
  }
  return {};
};

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
): Promise<void> => {
  const packageName = `bbc-morph-${name}`;
  const typeDirectory = createTypeDirectories[type];
  const fromDirectory = join(__dirname, `../../../../templates/${typeDirectory}`);
  const toDirectory = join(await system.process.getCurrentWorkingDirectory(), name);
  await system.file.copyDirectory(fromDirectory, toDirectory, false);

  const packageJSONPath = join(toDirectory, 'package.json');
  const packageJSON = JSON.parse(await system.file.readFile(packageJSONPath)) as Package;
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
  system.file.moveDirectory(npmIgnorePath, gitIgnorePath);
};

export { cloneComponentFiles, getShrinkwrap, createComponentFiles };
