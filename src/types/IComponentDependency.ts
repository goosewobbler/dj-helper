interface IComponentDependency {
  name: string;
  displayName: string;
  has: string;
  latest: string;
  linked: boolean;
  outdated: boolean;
  version: string;
}

export default IComponentDependency;
