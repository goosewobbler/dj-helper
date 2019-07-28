export default interface Handlers {
  onOpenInCode(name: string): any;
  onBuild(name: string): any;
  onInstall(name: string): any;
  onSetUseCache(name: string, value: boolean): any;
  onBumpComponent(name: string, type: string): any;
  onPromoteComponent(name: string, environment: string): any;
  onSelectComponent(name: string): any;
  onLinkComponent(name: string, dependency: string): any;
  onUnlinkComponent(name: string, dependency: string): any;
}
