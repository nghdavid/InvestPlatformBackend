const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const RPC_URL = process.env.RPC_URL;
const privateKey = process.env.DEV_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const abiGovernorFactory = [
  "function createDao(string, address, address) public returns (address)",
  "calculateDaoAddr(address, address, string) public returns (address)"
];

const addressGovernorFactory = "0xC0218aC712f49871CfDf875eB773a422D48B7947";
const fundraiseName = "fundraise";
const addressVote = "0x9A78475BE1412bC735d940dbf6A7270367cAa226";
const addressTimeLock = "0x0FaF2F23647AD8FAA94aCe13635Df22A48A34A90";

async function main() {
  try {
    const contractGovernorFactory = new ethers.Contract(addressGovernorFactory, abiGovernorFactory, wallet)
    const tx = await contractGovernorFactory.createDao(fundraiseName, addressVote, addressTimeLock);
    await tx.wait();
    console.log(` 交易详情：`)
    console.log(tx)
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main(1);