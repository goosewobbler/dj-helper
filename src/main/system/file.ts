import { copy, ensureDirSync, moveSync, WriteStream } from 'fs-extra';
import { existsSync, lstatSync, readFileSync, symlinkSync, unlinkSync, writeFileSync } from 'graceful-fs';
import ls from 'ls';
import watch from 'node-watch';
import { join } from 'path';

import { logError } from '../helpers/console';
import { FileSystem } from '../../common/types';

interface File {
  name: string;
  full: string;
}

const ignore = [
  '/.tscache/',
  '/.cache/',
  '/.git/',
  '/coverage/',
  '/node_modules/',
  '/test/',
  '/package.json',
  '/package-lock.json',
  '/shrinkwrap.yaml',
];

const copyIgnore = [
  '/.tscache/',
  '/.cache/',
  '/.git/',
  '/coverage/',
  '/node_modules/',
  '/package-lock.json',
  '/shrinkwrap.yaml',
];

const exists = (path: string): Promise<boolean> => Promise.resolve(existsSync(path));

const getPackageDirectories = (directory: string): string[] =>
  ls(join(directory, '*'))
    .filter((file: File): boolean => lstatSync(file.full).isDirectory())
    .filter((file: File): boolean => existsSync(join(file.full, 'package.json')))
    .map((file: File): string => file.name);

const readFile = (path: string): Promise<string> => Promise.resolve(readFileSync(path).toString());

const writeFile = (path: string, contents: string): Promise<void> => Promise.resolve(writeFileSync(path, contents));

const symbolicLinkExists = (path: string): Promise<boolean> =>
  Promise.resolve(existsSync(path) && lstatSync(path).isSymbolicLink());

const deleteDirectory = (directory: string): void => {
  try {
    const to = `/tmp/mdc.deleted.${Date.now()}`;
    moveSync(directory, to);
  } catch (ex) {
    // ignore
  }
  try {
    ensureDirSync(directory);
  } catch (ex) {
    // ignore
  }
};

const watchDirectory = (directory: string, callback: (path: string) => void): Promise<void> =>
  Promise.resolve(
    watch(
      directory,
      {
        filter: (name: string): boolean => !ignore.some((pathToIgnore: string): boolean => name.includes(pathToIgnore)),
        recursive: true,
      },
      (event: string, fileName: string): void => {
        if (event === 'remove' || lstatSync(fileName).isFile()) {
          const fileChanged = fileName.replace(`${directory}/`, '');
          callback(fileChanged);
        }
      },
    ),
  );

const copyDirectory = async (from: string, to: string, filter: boolean): Promise<void> =>
  new Promise((resolve, reject): void =>
    copy(
      from,
      to,
      {
        filter: (name: string): boolean =>
          !filter || !copyIgnore.some((pathToIgnore: string): boolean => name.includes(pathToIgnore)),
      },
      (error: Error | Error[] | WriteStream | null): void => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      },
    ),
  );

const moveDirectory = (from: string, to: string): void => {
  try {
    moveSync(from, to);
  } catch (ex) {
    logError(ex);
  }
};

const createSymlink = (from: string, to: string): void => {
  try {
    symlinkSync(from, to);
  } catch (ex) {
    logError(ex);
  }
};

const removeSymlink = (path: string): void => {
  try {
    unlinkSync(path);
  } catch (ex) {
    logError(ex);
  }
};

const file: FileSystem = {
  copyDirectory,
  createSymlink,
  deleteDirectory,
  exists,
  getPackageDirectories,
  moveDirectory,
  readFile,
  removeSymlink,
  symbolicLinkExists,
  watchDirectory,
  writeFile,
};

export default file;
