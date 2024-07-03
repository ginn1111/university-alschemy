const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const getAddressFromPublicKey = (publicKey) => {
  const offOneBit = publicKey.slice(1);

  return `0x${toHex(offOneBit.slice(-20))}`;
};

const generateKeyPair = () => {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);
  const address = getAddressFromPublicKey(publicKey);

  return {
    privateKey: `0x${toHex(privateKey)}`,
    publicKey: `0x${toHex(publicKey)}`,
    address,
  };
};

module.exports = {
  generateKeyPair,
  getAddressFromPublicKey,
};
