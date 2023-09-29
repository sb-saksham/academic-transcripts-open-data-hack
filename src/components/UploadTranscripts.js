import React from "react";
import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';
import {  useState } from 'react';

function UploadTranscriptsPage() {
    const[cid,SetCid]=useState("");
    const [account, setAccount] = useState('');

  const encryptionSignature = async() =>{
    const { ethereum } = window;
    if(!ethereum){
        alert("please install metamask" )
    }
    if (ethereum) {
      const accounts = await ethereum.request({
          method: 'eth_requestAccounts',
      });

      window.ethereum.on('chainChanged', () => {
          window.location.reload();
      });

      window.ethereum.on('accountsChanged', () => {
          window.location.reload();
      });
    const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data.message;
    const signedMessage = await signer.signMessage(messageRequested);
    setAccount(accounts[0]);
    return({
      signedMessage: signedMessage,
      publicKey: address,
    });
  }
  }
  const progressCallback = (progressData) => {
    let percentageDone =
      100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
    console.log(percentageDone);
  };

  /* Deploy file along with encryption */
  const uploadFileEncrypted = async(file) =>{
    /*
       uploadEncrypted(e, accessToken, publicKey, signedMessage, uploadProgressCallback)
       - e: js event
       - accessToken: your API key
       - publicKey: wallets public key
       - signedMessage: message signed by the owner of publicKey
       - dealParameters: default null
       - uploadProgressCallback: function to get progress (optional)
    */
    const sig = await encryptionSignature();
    const response = await lighthouse.uploadEncrypted(
      file,
      "52e175d8.5a6d380c102e4fc49a5b5ecb2c19a5f1",
      sig.publicKey,
      sig.signedMessage,
      null,
      progressCallback
      );
     console.log(response.data);
      const { Hash } = response.data[0]
      // Conditions to add
    const conditions = [
        {
            id: 1,
            chain: "Calibration",
            method: "hasAccess",
            standardContractType: "Custom",
            contractAddress: "0xA542053D73b1048D43704491c54d34882Ac4439f",
            returnValueTest: {
                comparator: "==",
                value: "true"
            },
            parameters: [account, ":userAddress", ethers.utils.formatBytes32String("content")],
            inputArrayType: ["address", "address", "bytes32"],
            outputType: "bool"
        },
      ];
  
      // Aggregator is what kind of operation to apply to access conditions
      // Suppose there are two conditions then you can apply ([1] and [2]), ([1] or [2]), !([1] and [2]).
      const aggregator = "([1])";
      const res = await lighthouse.applyAccessCondition(
        sig.publicKey,
        Hash,
        sig.signedMessage,
        conditions,
        aggregator
      );
      console.log(res.data);
    SetCid(Hash)
    /*
      output:
        data: [{
          Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
          Size: "318557",
          Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
        }]
      Note: Hash in response is CID.
    */
  }

  return (
     <div className="App">
       <div className="text-center flex justify-center items-center mt-1">
        <div>
            {account !== '' ? (
                <p>Connected Account: {account}</p>
            ) : (
                <button onClick={()=>encryptionSignature()}>Connect Metmask</button>
            )}
        </div>
        {cid}
    </div>
    <input onChange={e=>uploadFileEncrypted(e.target.files)} type="file" />      
    <a target="_blank" rel="noreferrer" href={`https://files.lighthouse.storage/viewFile/${cid}`} >View File</a>
    </div>
  );
}

export default UploadTranscriptsPage;