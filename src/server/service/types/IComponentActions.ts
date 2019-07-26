interface IComponentActions {
  buildAll(): Promise<void>;
  buildSass(): Promise<void>;
  install(): Promise<void>;
  link(dependency: string): Promise<void>;
  makeOtherLinkable(name: string): Promise<void>;
  needsInstall(): Promise<boolean>;
  run(): Promise<void>;
  stop(): Promise<void>;
  uninstall(): Promise<void>;
  unlink(dependency: string): Promise<void>;
}

export default IComponentActions;
