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
    let value = await testcontractDeployed.value();
    console.log('Value is ', value.toString());
    let setValue = await testcontractDeployed.setValue(10); 
    let receipt = await setValue.wait();
    console.log('Transaction receipt:', receipt);
    value = await testcontractDeployed.value();
    console.log('Value is ', value.toString());


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });