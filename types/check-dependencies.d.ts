declare module 'check-dependencies' {
  export default function(options: { packageDir?: string }): Promise<{ status: number; error: string[] }>;
}
