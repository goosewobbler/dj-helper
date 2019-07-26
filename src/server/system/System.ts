import ISystem from '../types/ISystem';
import FileSystem from './FileSystem';
import GitSystem from './GitSystem';
import MorphSystem from './MorphSystem';
import NetworkSystem from './NetworkSystem';
import ProcessSystem from './ProcessSystem';

const System: ISystem = {
  file: FileSystem,
  git: GitSystem,
  morph: MorphSystem,
  network: NetworkSystem,
  process: ProcessSystem,
};

export default System;
