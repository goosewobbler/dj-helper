import * as morphCli from 'morph-cli';
import * as morphPromote from 'morph-cli/lib/commands/promote'; // tslint:disable-line no-submodule-imports
import getShrinkwrap from '../helpers/shrinkwrapped';

interface MorphSystem {
  getShrinkwrap(name: string): Promise<{ [Key: string]: string }>;
  getVersionOnEnvironment(name: string, environment: string): Promise<string>;
  promote(name: string, environment: string): Promise<void>;
}

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

export { morph, MorphSystem };
