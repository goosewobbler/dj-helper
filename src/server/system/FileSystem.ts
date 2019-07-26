import { ensureDirSync, moveSync } from 'fs-extra';
import { existsSync, lstatSync, readFileSync, symlinkSync, unlinkSync, writeFileSync } from 'graceful-fs';
import { some } from 'lodash/fp';
import * as ls from 'ls';
import * as ncp from 'ncp';
import * as watch from 'node-watch';
import { join } from 'path';
import IFileSystem from '../types/IFileSystem';

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

const exists = (path: string) => Promise.resolve(existsSync(path));

const getPackageDirectories = async (directory: string) =>
  (ls as any)(join(directory, '*'))
    .filter((file: any) => lstatSync(file.full).isDirectory())
    .filter((file: any) => existsSync(join(file.full, 'package.json')))
    .map((file: any) => file.name);

const readFile = (path: string) => Promise.resolve(readFileSync(path).toString());

const writeFile = (path: string, contents: string) => Promise.resolve(writeFileSync(path, contents));

const symbolicLinkExists = (path: string) => Promise.resolve(existsSync(path) && lstatSync(path).isSymbolicLink());

const deleteDirectory = async (directory: string) => {
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

const watchDirectory = (directory: string, callback: (path: string) => void) =>
  Promise.resolve(
    (watch as any)(
      directory,
      {
        filter: (name: string) => !some((pathToIgnore: string) => name.indexOf(pathToIgnore) > -1, ignore),
        recursive: true,
      },
      (event: string, fileName: string) => {
        if (event === 'remove' || lstatSync(fileName).isFile()) {
          const fileChanged = fileName.replace(`${directory}/`, '');
          callback(fileChanged);
        }
      },
    ),
  );

const copyDirectory = async (from: string, to: string) =>
  new Promise<void>((resolve, reject) =>
    (ncp as any)(from, to, (error: any) => {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    }),
  );

const moveDirectory = async (from: string, to: string) => {
  try {
    moveSync(from, to);
  } catch (ex) {
    console.error(ex);
  }
};

const createSymlink = async (from: string, to: string) => {
  try {
    symlinkSync(from, to);
  } catch (ex) {
    console.error(ex);
  }
};

const removeSymlink = async (path: string) => {
  try {
    unlinkSync(path);
  } catch (ex) {
    console.error(ex);
  }
};

const FileSystem: IFileSystem = {
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

export default FileSystem;
