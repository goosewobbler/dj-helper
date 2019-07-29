export default interface NetworkSystem {
  get(url: string): Promise<{ body: string; headers: { [Key: string]: string }; statusCode: number }>;
}
