interface IState {
  retrieve(key: string): any;
  store(key: string, value: any): Promise<void>;
}

export default IState;
