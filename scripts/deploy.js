const { ethers } = require("hardhat");

async function main () {

    // get signers
    const [deployer] = await ethers.getSigners();

    //get contract 
    const Testcontract = await ethers.getContractFactory('TestContract');


    //deploy contract
    const testcontractDeployed = await Testcontract.deploy();
    await testcontractDeployed.waitForDeployment();

    console.log("Deploying contracts with the account:", deployer.address);
    console.log('TestContract deployed to:', testcontractDeployed.target);

    //interact with contract
    


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });