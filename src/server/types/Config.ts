export default interface Config {
  isFeatureEnabled(feature: string): boolean;
  getValue(name: string): any;
  setValue(name: string, value: any): Promise<void>;
}
