const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const addressVote = "0x9A78475BE1412bC735d940dbf6A7270367cAa226";
const addressTimeLock = "0x0FaF2F23647AD8FAA94aCe13635Df22A48A34A90";
const addressCompany = "0x8e33a24CD96a0dbA80E57DD2f0D3c70338Ab046C";
const addressTreasuryFactory = "0x73cCC25c8f13e18B81059B3e39a11aE04dd8B382";
const realTreasuryAddress = "0x804A572C205b3C0490e84d0834127CD44A84192B";
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
async function calculateTreasuryAddr(timelock, voteToken) {
  const salt = ethers.keccak256(
    ethers.solidityPacked(
      ['address', 'address'],
      [timelock, voteToken]
    )
  );

  const constructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address'],
    [addressCompany]
  );
  const bytecodeTreasury = await readTextFile('treasury.txt');
  const contractBytecode = ethers.concat([bytecodeTreasury, constructorArgs]);

  const initCodeHash = ethers.keccak256(contractBytecode);

  const predictedAddress = ethers.getCreate2Address(
    addressTreasuryFactory,
    salt,
    initCodeHash,
  );

  return predictedAddress;
}

async function main() {
  const treasuryAddress = await calculateTreasuryAddr(addressTimeLock, addressVote);
  console.log(`Treasury Address: ${treasuryAddress}`);
  console.log(`Real Address: ${realTreasuryAddress}`);
  }
main();