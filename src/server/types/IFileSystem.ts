interface IFileSystem {
  exists(path: string): Promise<boolean>;
  getPackageDirectories(directory: string): Promise<string[]>;
  readFile(path: string): Promise<string>;
  writeFile(path: string, contents: string): Promise<void>;
  symbolicLinkExists(path: string): Promise<boolean>;
  copyDirectory(from: string, to: string): Promise<void>;
  deleteDirectory(directory: string): Promise<void>;
  watchDirectory(directory: string, callback: (path: string) => void): Promise<void>;
  moveDirectory(from: string, to: string): Promise<void>;
  createSymlink(from: string, to: string): Promise<void>;
  removeSymlink(path: string): Promise<void>;
}

export default IFileSystem;
