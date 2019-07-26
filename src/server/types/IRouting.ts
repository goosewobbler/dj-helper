interface IRouting {
  updateRoute(componentName: string, port: number): Promise<void>;
}

export default IRouting;
