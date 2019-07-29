export default interface State {
  retrieve(key: string): any;
  store(key: string, value: any): Promise<void>;
}
