declare module 'morph-cli' {
  function getVersionOnEnvironment(name: string, environment: string): Promise<string>;
}

declare module 'morph-cli/lib/commands/promote' {
  function action(options: { environment: string; module: string; version: string }): Promise<void>;
}
