const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const tokenA = "0x2c44b726ADF1963cA47Af88B284C06f30380fC78";
const tokenB = "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c";
const contractAddress = "0x5615dEB798BB3E4dFa0139dFa1b3D433Cc23b72f";
const realAddress = "0x0b208077da66782eD68eEb2037c79dD91fcD4420";
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


async function calculatePairAddr(tokenA, tokenB) {
  // Sort tokenA and tokenB by address
  const [token0, token1] = tokenA.toLowerCase() < tokenB.toLowerCase()
    ? [tokenA, tokenB]
    : [tokenB, tokenA];

  const salt = ethers.keccak256(
    ethers.solidityPacked(
      ['address', 'address'],
      [token0, token1]
    )
  );
  
  const bytecodePair = await readTextFile('pair.txt');
  const initCodeHash = ethers.keccak256(bytecodePair);

  const predictedAddress = ethers.getCreate2Address(
    contractAddress,
    salt,
    initCodeHash,
  );

  return predictedAddress;
}

async function main() {
  const pairAddress = await calculatePairAddr(tokenA, tokenB);
  console.log(`Pair Address: ${pairAddress}`);
  console.log(`Real Address: ${realAddress}`);
}
main();