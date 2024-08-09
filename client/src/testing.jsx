import React from 'react'

function testing() {

    async function getAllGroupsData() {
        const signer = await provider.getSigner();
        const tx = await testContract.connect(signer).getAllGroups();
        setAllGroups(tx);
        console.log(tx);
      }
    
      async function loadBlockchainData() {
    
        if (typeof window.ethereum === "undefined") {
          alert("Please install MetaMask");
          return;
        }
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(provider);
        const network = await provider.getNetwork();
        const testContract = new ethers.Contract(
          config[network.chainId].TestContract.address,
          TestContract,
          provider
        );
        setTestContract(testContract);
        try {
          const value = await testContract.getGroupCount();
          setGroupCount(value.toString());
        } catch (error) {
          console.log(error);
        }
        window.ethereum.on("accountsChanged", async () => {
          loadAccount();
        });
      }
    
      async function loadAccount() {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      }
    
      async function createGroupHandler(e) {
        e.preventDefault();
        const signer = await provider.getSigner();
        const groupName = e.target.children.groupName.value;
        const stakeAmount = e.target.children.stakeAmount.value;
        const username = e.target.children.username.value;
    
        const tx = await testContract
          .connect(signer)
          .createGroup(groupName, stakeAmount, username);
        await tx.wait();
        const value = await testContract.getGroupCount();
        setGroupCount(value.toString());
    
        getAllGroupsData();
      }
    
      useEffect(() => {
        loadBlockchainData();
        loadAccount();
      }, []);
  return (
    <div>testing</div>
  )
}

export default testing


const network = await provider.getNetwork();
const contract = new ethers.Contract(
    config[network.chainId].TestContract.address,
    TestContract,
    provider
  );