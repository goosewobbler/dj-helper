export default interface Routing {
  updateRoute(componentName: string, port: number): Promise<void>;
}
