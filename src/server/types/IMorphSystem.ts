interface IMorphSystem {
  getShrinkwrapped(name: string): Promise<{ [Key: string]: string }>;
  getVersionOnEnvironment(name: string, environment: string): Promise<string>;
  promote(name: string, environment: string): Promise<void>;
}

export default IMorphSystem;
