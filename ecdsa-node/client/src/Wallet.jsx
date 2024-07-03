import { secp256k1 } from "ethereum-cryptography/secp256k1";
import server from "./server";
import { getAddressFromPrivateKey } from "./utils";
import { useState } from "react";

/**
0 {
  privateKey: '0x9d4883fa7ffad826549df83917fb32bd795f5359c7593cd2b4092092fde93724',
  publicKey: '0x026c3bf28721f73a606bde2fb0dab3fee06a501fa93a41af3c1348f986f1df0877',
  address:  '0xdab3fee06a501fa93a41af3c1348f986f1df0877',
}
1 {
  privateKey: '0xfef0fa1d48a5d669ecf5639fd177d0ce44e6e514d7194918e1d079e2e766207c',
  publicKey: '0x02676dc9e1ffa018f9dc94caa01fd0b6bf9d1fd64f0e955f31b64389f043d6c254'
  address:  '0x1fd0b6bf9d1fd64f0e955f31b64389f043d6c254',
}
*/

function Wallet({ balance, setBalance, setPrivateKey }) {
  const [address, setAddress] = useState("");

  async function onChange(evt) {
    const privateKey = evt.target.value;

    if (!secp256k1.utils.isValidPrivateKey(privateKey.slice(2))) {
      return;
    }
    setPrivateKey(privateKey);

    const address = getAddressFromPrivateKey(privateKey);
    setAddress(address);

    if (address) {
      const response = await server.get(`/balance/${address}`);
      const { balance } = response.data;

      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>
      <label>
        Private key
        <input placeholder="Enter your private key..." onChange={onChange} />
      </label>
      <p>
        Your address: {address.slice(0, 10)} ... {address.slice(-10)}
      </p>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
