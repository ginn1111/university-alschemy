const express = require("express");
const { utf8ToBytes, hexToBytes } = require("ethereum-cryptography/utils");
const app = express();
const cors = require("cors");
const { getAddressFromPublicKey } = require("./utils");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = {
  "0xdab3fee06a501fa93a41af3c1348f986f1df0877": 10,
  "0x1fd0b6bf9d1fd64f0e955f31b64389f043d6c254": 100,
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  return res.status(200).json({ balance });
});

app.post("/send", (req, res) => {
  const { message, signature, publicKey } = req.body;

  const hashMsg = keccak256(utf8ToBytes(message));

  const sig = {
    s: BigInt(signature.s),
    r: BigInt(signature.r),
    recovery: signature.recovery,
  };

  const isSigned = secp256k1.verify(sig, hashMsg, publicKey.slice(2));

  if (!isSigned) {
    return res.status(409).json("Invalid signature!");
  }

  const { sendAmount, recipient } = JSON.parse(message);

  if (
    !recipient ||
    balances[recipient] == null ||
    !sendAmount ||
    isNaN(sendAmount)
  ) {
    return res.status(409).json("Data is invalid!");
  }

  const parseAmount = parseInt(sendAmount);
  const address = getAddressFromPublicKey(hexToBytes(publicKey.slice(2)));

  if (parseAmount > balances[address]) {
    return res.status(409).json("Balance is insufficient!");
  }

  balances[recipient] += parseAmount;
  balances[address] -= parseAmount;

  console.log("TRANSACTION SUCCESSULL", balances);

  res.status(200).json(balances[address]);
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});
