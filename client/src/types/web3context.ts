import Web3 from "web3";
import { Contract } from "web3-eth-contract";

interface Web3ContextType {
  web3?: Web3 | null;
  eventContract?: Contract;
  eventAddress?: String;
  account?: String;
}

export default Web3ContextType;
