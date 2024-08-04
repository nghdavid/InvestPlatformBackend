const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const RPC_URL = process.env.RPC_URL;
const privateKey = process.env.DEV_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const abiTimeLock = [
  "constructor(uint256 _minDelay, address[] memory _proposers, address[] memory _executors, address _admin)"
];

async function readTextFile(filePath) {
  try {
    let text = await fs.readFile(filePath, 'utf8');
    text = text.replace(/\n/g, '');
    return text;
  } catch (error) {
    console.error("Error reading the file:", error);
    throw error;
  }
}

async function main(timelockDelay) {
  try {
    const emptyAddressArray = [];
    const bytecodeTimeLock = await readTextFile('timelock.txt');
    const factoryTimeLock = new ethers.ContractFactory(abiTimeLock, bytecodeTimeLock, wallet);
    const contractTimeLock = await factoryTimeLock.deploy(timelockDelay, emptyAddressArray, emptyAddressArray,"0xC0218aC712f49871CfDf875eB773a422D48B7947");
    console.log (`合约地址: ${contractTimeLock.target}`);
    console.log ("部署合约的交易详情")
    console.log(contractTimeLock.deploymentTransaction())
    console.log ("\n 等待合约部署上链")
    await contractTimeLock.waitForDeployment()
    console.log ("合约已上链")
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main(1);