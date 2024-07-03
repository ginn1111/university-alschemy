import React, { useState } from "react";
import server from "./server";
import { toHex } from "ethereum-cryptography/utils";
import { getPublicKeyFromPrivateKey, hashAndSignMsg } from "./utils";

function Transfer({ setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function handleTransfer(e) {
    e.preventDefault();

    if (!privateKey) {
      alert("Not authenticated!");
      return;
    }

    if (!sendAmount) {
      alert("Enter amount please!");
      return;
    }

    const { message, signature } = hashAndSignMsg(
      JSON.stringify({ sendAmount, recipient }),
      privateKey,
    );

    try {
      const response = await server.post(`send`, {
        signature: {
          r: `0x${signature.r.toString(16)}`,
          s: `0x${signature.s.toString(16)}`,
          recovery: signature.recovery,
        },
        message,
        publicKey: `0x${toHex(getPublicKeyFromPrivateKey(privateKey))}`,
      });
      setBalance(response.data);
    } catch (ex) {
      console.log(ex);
    }
  }

  return (
    <form className="container transfer" onSubmit={handleTransfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
