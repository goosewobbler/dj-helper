import * as morph from 'morph-cli';
import * as morphPromote from 'morph-cli/lib/commands/promote'; // tslint:disable-line no-submodule-imports

import MorphSystem from '../types/MorphSystem';
import getShrinkwrapped from './helpers/shrinkwrapped';

const getVersionOnEnvironment = async (name: string, environment: string) =>
  (await morph.getVersionOnEnvironment(name, environment)) || '';

const promote = async (name: string, environment: string) =>
  morphPromote.action({
    environment,
    module: name,
    version: 'latest',
  });

const MorphSystemExport: MorphSystem = {
  getShrinkwrapped,
  getVersionOnEnvironment,
  promote,
};

export default MorphSystemExport;
