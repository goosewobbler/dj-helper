import { emptyDirSync, readFileSync } from 'fs-extra';
import { join } from 'path';
import * as tar from 'tar';

import runNpm from './npm';

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
    (): void => null,
  );
  return output;
};

const getVersions = (raw: string): { [Key: string]: string } => {
  const shrinkwrap = JSON.parse(raw);
  const has: { [Key: string]: string } = {};
  Object.keys(shrinkwrap.dependencies).forEach((dependency: string): void => {
    has[dependency] = shrinkwrap.dependencies[dependency].version;
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

export default getShrinkwrap;
