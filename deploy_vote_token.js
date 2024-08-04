const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const RPC_URL = process.env.RPC_URL;
const privateKey = process.env.DEV_PRIVATE_KEY;
const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(privateKey, provider);

const abiVoteToken = [
  "constructor(address initialOwner)",
  "function mint(address to, uint256 amount) public",
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

async function main() {
  try {
    const bytecodeVoteToken = await readTextFile('voteToken.txt');
    const factoryVoteToken = new ethers.ContractFactory(abiVoteToken, bytecodeVoteToken, wallet);
    const contractVoteToken = await factoryVoteToken.deploy("0x73cCC25c8f13e18B81059B3e39a11aE04dd8B382");
    console.log (`合约地址: ${contractVoteToken.target}`);
    console.log ("部署合约的交易详情")
    // console.log(contractVoteToken.deploymentTransaction())
    console.log ("\n 等待合约部署上链")
    await contractVoteToken.waitForDeployment()
    console.log ("合约已上链")
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

main();