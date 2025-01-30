declare module '@/utils/cryptoFunctions' {
  export async function createHMAC_SHA256(data: string, key: ArrayBuffer): ArrayBuffer;
  
  export async function createSHA256(data: string, algorithm: string = 'SHA-256'): string;
}