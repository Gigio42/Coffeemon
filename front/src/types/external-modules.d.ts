declare module 'fast-png' {
  interface DecodeResult {
    data: Uint8Array;
    width: number;
    height: number;
  }

  export function decode(data: Uint8Array): DecodeResult;
}

declare module 'base-64' {
  export function encode(text: string): string;
  export function decode(text: string): string;
}

declare module 'upng-js' {
  interface UPNGImage {
    width: number;
    height: number;
    depth: number;
    ctype: number;
    data: ArrayBuffer;
  }

  function decode(buffer: ArrayBuffer): UPNGImage;
  function toRGBA8(img: UPNGImage): Uint8Array[];

  const UPNG: {
    decode: typeof decode;
    toRGBA8: typeof toRGBA8;
  };

  export default UPNG;
}
