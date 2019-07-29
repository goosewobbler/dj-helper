import System from '../types/System';
import FileSystem from './FileSystem';
import GitSystem from './GitSystem';
import MorphSystem from './MorphSystem';
import NetworkSystem from './NetworkSystem';
import ProcessSystem from './ProcessSystem';

export default {
  file: FileSystem,
  git: GitSystem,
  morph: MorphSystem,
  network: NetworkSystem,
  process: ProcessSystem,
} as System;
