const ethers = require('ethers');
const fs = require('fs').promises;
require('dotenv').config();

const fundraiseName = "fundraise";
const addressVote = "0x9A78475BE1412bC735d940dbf6A7270367cAa226";
const addressTimeLock = "0x0FaF2F23647AD8FAA94aCe13635Df22A48A34A90";

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
async function calculateDaoAddr(timelock, voteToken, daoName) {
  const salt = ethers.keccak256(
    ethers.AbiCoder.defaultAbiCoder().encode(
      ['address', 'address'],
      [timelock, voteToken]
    )
  );

  const constructorArgs = ethers.AbiCoder.defaultAbiCoder().encode(
    ['address', 'address', 'string'],
    [voteToken, timelock, daoName]
  );
  const bytecodeDao = await readTextFile('dao.txt');
  const contractBytecode = ethers.concat([bytecodeDao, constructorArgs]);

  const initCodeHash = ethers.keccak256(contractBytecode);

  const predictedAddress = ethers.getCreate2Address(
    ethers.ZeroAddress,
    salt,
    initCodeHash,
  );

  return predictedAddress;
}

async function main() {
  const daoAddress = await calculateDaoAddr(addressTimeLock, addressVote, fundraiseName);
  console.log(`DAO Address: ${daoAddress}`);
  }
main();