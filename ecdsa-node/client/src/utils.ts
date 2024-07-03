import { keccak256 } from "ethereum-cryptography/keccak";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { hexToBytes, toHex, utf8ToBytes } from "ethereum-cryptography/utils";
const MAX_BOUND = 2 ** 8 - 1;

export const getRandomKey32Bytes = () => {
  const arr8 = new Uint8Array(32); // 0 -> 255: 2^8-1

  for (let i = 0; i < 32; i++) {
    arr8[i] = Math.floor(Math.random() * (MAX_BOUND + 1));
  }

  return `0x${toHex(arr8)}`;
};

export const getAddressFromPrivateKey = (privateKey: string) => {
  const publicKey = getPublicKeyFromPrivateKey(privateKey);
  return `0x${toHex(publicKey.slice(1).slice(-20))}`;
};

export const getPublicKeyFromPrivateKey = (privateKey: string) =>
  secp256k1.getPublicKey(privateKey.slice(2));

export const hashAndSignMsg = (message: string, privateKey: string) => {
  const hashMsg = keccak256(utf8ToBytes(message));
  const signature = secp256k1.sign(toHex(hashMsg), privateKey.slice(2));

  return {
    message,
    signature,
  };
};
