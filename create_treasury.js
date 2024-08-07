const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const RPC_URL = process.env.RPC_URL;
const privateKey = process.env.DEV_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const abiTreasuryFactory = [
  "function createTreasury(string, address, address, address, address, uint32, uint32) public returns (address)",
  "function getDAOInfo(address, address) public returns (DAOInfo[])",
  "calculateTreasuryAddr(address, address, address) public returns (address)"
];

const addressTreasuryFactory = "0xC0218aC712f49871CfDf875eB773a422D48B7947";
const fundraiseName = "fundraise";
const addressFundToken = "0x9A78475BE1412bC735d940dbf6A7270367cAa226";

const addressVoteToken = "0x9A78475BE1412bC735d940dbf6A7270367cAa226";
const addressTimeLock = "0x0FaF2F23647AD8FAA94aCe13635Df22A48A34A90";
const addressCompany = "0x0FaF2F23647AD8FAA94aCe13635Df22A48A34A90";
const duration = 10;
const fundraiseTime = 10;

async function main() {
  try {
    const contractTreasuryFactory = new ethers.Contract(addressTreasuryFactory, abiTreasuryFactory, wallet)
    const tx = await contractTreasuryFactory.createTreasury(fundraiseName, addressFundToken, addressVoteToken, addressTimeLock, addressCompany, fundraiseTime, duration);
    await tx.wait();
    console.log(` 交易详情：`)
    console.log(tx)
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main(1);