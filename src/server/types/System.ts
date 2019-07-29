import FileSystem from './FileSystem';
import GitSystem from './GitSystem';
import MorphSystem from './MorphSystem';
import NetworkSystem from './NetworkSystem';
import ProcessSystem from './ProcessSystem';

export default interface System {
  file: FileSystem;
  git: GitSystem;
  morph: MorphSystem;
  network: NetworkSystem;
  process: ProcessSystem;
}
