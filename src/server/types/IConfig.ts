interface IConfig {
  isFeatureEnabled(feature: string): boolean;
  getValue(name: string): any;
  setValue(name: string, value: any): Promise<void>;
}

export default IConfig;
