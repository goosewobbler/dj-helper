import * as morphCli from 'morph-cli';
import * as morphPromote from 'morph-cli/lib/commands/promote'; // tslint:disable-line no-submodule-imports
import { getShrinkwrap } from '../helpers/files';
import { MorphSystem } from '../../common/types';

const getVersionOnEnvironment = async (name: string, environment: string): Promise<string> =>
  (await morphCli.getVersionOnEnvironment(name, environment)) || '';

const promote = async (name: string, environment: string): Promise<void> =>
  morphPromote.action({
    environment,
    module: name,
    version: 'latest',
  });

const morph: MorphSystem = {
  getShrinkwrap,
  getVersionOnEnvironment,
  promote,
};

export default morph;
