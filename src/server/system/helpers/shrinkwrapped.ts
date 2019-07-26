import { emptyDirSync, readFileSync } from 'fs-extra';
import { join } from 'path';
import * as tar from 'tar';

import runNpm from '../../helpers/runNpm';
import System from '../System';

const extract = (directory: string, tarballName: string, file: string) =>
  new Promise<string>((resolve, reject) => {
    const tarballPath = join(directory, tarballName);

    tar.extract(
      {
        cwd: directory,
        file: tarballPath,
      },
      [file],
      error => {
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

const pack = async (directory: string, packageName: string) => {
  let output = '';
  await runNpm(
    System,
    directory,
    ['pack', packageName],
    (message: string) => {
      output = message.toString().trim();
    },
    (message: string) => null,
  );
  return output;
};

const getVersions = (raw: string) => {
  const shrinkwrap = JSON.parse(raw);
  const has: { [Key: string]: string } = {};
  Object.keys(shrinkwrap.dependencies).forEach((dependency: string) => {
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
