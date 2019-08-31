import file from './file';
import git from './git';
import morph from './morph';
import network from './network';
import process from './process';
import { System } from '../../common/types';

const system: System = {
  file,
  git,
  morph,
  network,
  process,
};

export default system;
