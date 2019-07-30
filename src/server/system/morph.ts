import * as morphCli from 'morph-cli';
import * as morphPromote from 'morph-cli/lib/commands/promote'; // tslint:disable-line no-submodule-imports
import getShrinkwrapped from '../helpers/shrinkwrapped';

interface MorphSystem {
  getShrinkwrapped(name: string): Promise<{ [Key: string]: string }>;
  getVersionOnEnvironment(name: string, environment: string): Promise<string>;
  promote(name: string, environment: string): Promise<void>;
}

const getVersionOnEnvironment = async (name: string, environment: string) =>
  (await morphCli.getVersionOnEnvironment(name, environment)) || '';

const promote = async (name: string, environment: string) =>
  morphPromote.action({
    environment,
    module: name,
    version: 'latest',
  });

const morph: MorphSystem = {
  getShrinkwrapped,
  getVersionOnEnvironment,
  promote,
};

export { morph, MorphSystem };
