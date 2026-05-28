declare module "png-chunks-extract" {
  interface Chunk { name: string; data: Uint8Array }
  const fn: (data: Uint8Array) => Chunk[];
  export default fn;
}
declare module "png-chunks-encode" {
  interface Chunk { name: string; data: Uint8Array }
  const fn: (chunks: Chunk[]) => Uint8Array;
  export default fn;
}
declare module "png-chunk-text" {
  interface Chunk { name: string; data: Uint8Array }
  export function encode(keyword: string, text: string): Chunk;
  export function decode(data: Uint8Array): { keyword: string; text: string };
  const _default: { encode: typeof encode; decode: typeof decode };
  export default _default;
}
