interface INetworkSystem {
  get(url: string): Promise<{ body: string; headers: { [Key: string]: string }; statusCode: number }>;
}

export default INetworkSystem;
