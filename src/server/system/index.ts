import { file, FileSystem } from './file';
import { git, GitSystem } from './git';
import { morph, MorphSystem } from './morph';
import { network, NetworkSystem } from './network';
import { process, ProcessSystem } from './process';

interface System {
  file: FileSystem;
  git: GitSystem;
  morph: MorphSystem;
  network: NetworkSystem;
  process: ProcessSystem;
}

const system: System = {
  file,
  git,
  morph,
  network,
  process,
};

export { system, System };
