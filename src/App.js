
import './App.css';
import { Addmemory } from './components/Addmemory';
import { Allmemories } from './components/Allmemories';
import { NavigationBar } from './components/NavigationBar';
import { useState, useEffect, useCallback } from "react";


import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";


import Memories from "./contracts/memories.abi.json";
import IERC from "./contracts/IERC.abi.json";




const ERC20_DECIMALS = 18;
const tipPrice = "1";


const contractAddress = "0x59c0E5CEEdF60163eAA1f875949916aeB2988e4c";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";



function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [mems, setMemories] = useState([]);
 


  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  const getBalance = useCallback(async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

      const contract = new kit.web3.eth.Contract(Memories, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  }, [address, kit]);


  


  const getMemories = useCallback(async () => {
    const memoriesLength = await contract.methods.getmemoriesLength().call();
    const memories = [];
    for (let index = 0; index < memoriesLength; index++) {
      let _memories = new Promise(async (resolve, reject) => {
      let memory = await contract.methods.getMemories(index).call();

        resolve({
          index: index,
          owner: memory[0],
          name: memory[1],
          description: memory[2],
          likes: memory[3],
          dislikes: memory[4],
          tips: memory[5]     
        });
      });
      memories.push(_memories);
    }


    const _memories = await Promise.all(memories);
    setMemories(_memories);
  }, [contract]);


  const addMemory = async (
    _name,
    _description,
  ) => {
    try {
      await contract.methods
        .addMemory(_name, _description)
        .send({ from: address });
      getMemories();
    } catch (error) {
      console.log(error);
    }
  };


  
  const Like = async (_index) => {
    try {
      await contract.methods.Like(_index).send({ from: address });
      getMemories();
      getBalance();
    } catch (error) {
      console.log(error);
    }};

    const disLike = async (_index) => {
      try {
        await contract.methods.disLike(_index).send({ from: address });
        getMemories();
        getBalance();
      } catch (error) {
        console.log(error);
      }};

      const deleteMemory = async (_index) => {
        try {
          await contract.methods.deleteMemory(_index).send({ from: address });
          getMemories();
          getBalance();
        } catch (error) {
          console.log(error);
        }};


        const Tip = async (_index) => {
          try {
            const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);
            const cost = new BigNumber(tipPrice)
              .shiftedBy(ERC20_DECIMALS)
              .toString();
            await cUSDContract.methods
              .approve(contractAddress, cost)
              .send({ from: address });
            await contract.methods.Tip(_index, cost).send({ from: address });
            getMemories();
            getBalance();
          } catch (error) {
            console.log(error);
          }};

    

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address, getBalance]);

  useEffect(() => {
    if (contract) {
      getMemories();
    }
  }, [contract, getMemories]);
  return (
    <div className="App">
      <NavigationBar cUSDBalance={cUSDBalance} />
      <Addmemory addMemory={addMemory}/>
      <Allmemories deleteMemory={deleteMemory} Like ={Like} disLike={disLike} Tip={Tip} mems={mems}/>
    </div>
  );
}

export default App;
