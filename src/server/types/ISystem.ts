import IFileSystem from './IFileSystem';
import IGitSystem from './GitSystem';
import IMorphSystem from './IMorphSystem';
import INetworkSystem from './INetworkSystem';
import IProcessSystem from './IProcessSystem';

interface ISystem {
  file: IFileSystem;
  git: IGitSystem;
  morph: IMorphSystem;
  network: INetworkSystem;
  process: IProcessSystem;
}

export default ISystem;
