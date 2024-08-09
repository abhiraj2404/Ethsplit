import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import TestContract from "./abis/testContract.json";
import config from "./config.json";
import Home from "./pages/Home";
import { Routes, Route } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import GroupPage from "./pages/GroupPage";

function App() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [groupCount, setGroupCount] = useState(0);
  const [allGroups, setAllGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [minimumStakeAmount, setMinimumStakeAmount] = useState(0);
  const [username, setUsername] = useState("");
  const [groupIndex, setGroupIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const [transactionIndex, setTransactionIndex] = useState(0);
  const [inFavor, setInFavor] = useState(true);
  const [allPendingTxns, setAllPendingTxns] = useState([]);
  const [allApprovedTxns, setAllApprovedTxns] = useState([]);
  const [account, setAccount] = useState(null);

  const initializeContract = async () => {
    try {
      // Check if MetaMask is installed and connected
      if (typeof window.ethereum !== "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        const signer = provider.getSigner();
        const network = await provider.getNetwork();
        const contract = new ethers.Contract(
          config[network.chainId].TestContract.address,
          TestContract,
          signer
        );
        setProvider(provider);
        setContract(contract);
      } else {
        console.error("MetaMask is not installed or not connected.");
      }
    } catch (error) {
      console.error("Error initializing contract:", error);
    }
  };

  useEffect(() => {
    initializeContract();
  }, []);

  const connectToMetaMask = async () => {
    try {
      if (!account) {
        // If not connected, initialize the contract
        await initializeContract();
      } else {
        console.log("Already connected");
      }
    } catch (error) {
      console.error("Error connecting to MetaMask:", error);
    }
  };

  useEffect(() => {
    // Automatically connect if MetaMask is already connected
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          initializeContract();
        }
      });
    }
  }, []);

  const getGroupCount = async () => {
    try {
      const count = await contract.getGroupCount();
      setGroupCount(count.toNumber());
    } catch (error) {
      console.error("Error getting group count:", error);
    }
  };

  const getAllGroups = async () => {
    try {
      const [names, minimumStakeAmounts, members, amountsPaid, nicknames] =
        await contract.getAllGroups();
      // console.log(names, minimumStakeAmounts, members, amountsPaid, nicknames);
      const allGroups = names.map((name, index) => ({
        name,
        minimumStakeAmount: ethers.utils.formatEther(
          minimumStakeAmounts[index].toString()
        ),
        members: members[index],
        amountsPaid: amountsPaid[index].map((amount) =>
          ethers.utils.formatEther(amount.toString())
        ),
        nicknames: nicknames[index],
      }));
      setAllGroups(allGroups);
    } catch (error) {
      console.error("Error getting all groups:", error);
    }
  };

  const createGroup = async (groupName, minimumStakeAmount, username) => {
    // The value being sent is derived from the input value for the minimum stake amount
    const weiAmount = ethers.utils.parseEther(minimumStakeAmount.toString());

    // Sending the exact amount as value along with the transaction
    const tx = await contract.createGroup(
      groupName,
      minimumStakeAmount,
      username,
      {
        value: weiAmount,
      }
    );

    await tx.wait();
    console.log("Group created successfully!");
  };

  const joinGroup = async (groupIndex, minimumStakeAmount, username) => {
    try {
      const weiAmount = ethers.utils.parseEther(minimumStakeAmount.toString());
      await contract.joinGroup(groupIndex, username, { value: weiAmount });
      console.log("Joined group successfully!");
    } catch (error) {
      console.error("Error joining group:", error);
    }
  };

  const addTransaction = async (groupIndex, description, amount) => {
    try {
      await contract.addTransaction(groupIndex, description, amount);
      console.log("Transaction added successfully!");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const voteOnTransaction = async (groupIndex, transactionIndex, inFavor) => {
    try {
      await contract.voteOnTransaction(groupIndex, transactionIndex, inFavor);
      console.log("Voted on transaction successfully!");
    } catch (error) {
      console.error("Error voting on transaction:", error);
    }
  };

  const viewAllPendingTransactions = async (groupIndex) => {
    try {
      const [descriptions, amounts, senders, votesInFavor, votesAgainst] =
        await contract.viewAllPendingTransactions(groupIndex);

      const allTransactions = descriptions.map((description, index) => {
        return {
          description,
          amount: amounts[index].toNumber(),
          sender: senders[index],
          votesInFavor: votesInFavor[index].toNumber(),
          votesAgainst: votesAgainst[index].toNumber(),
        };
      });
      setAllPendingTxns(allTransactions);

      console.log("All Pending Transactions:", allTransactions);
    } catch (error) {
      console.error("Error viewing all transactions:", error);
    }
  };

  const viewAllApprovedTransactions = async (groupIndex) => {
    try {
      const [descriptions, amounts, senders, votesInFavor, votesAgainst] =
        await contract.viewAllApprovedTransactions(groupIndex);
      const allTransactions = descriptions.map((description, index) => {
        return {
          description,
          amount: amounts[index].toNumber(),
          sender: senders[index],
          votesInFavor: votesInFavor[index].toNumber(),
          votesAgainst: votesAgainst[index].toNumber(),
        };
      });
      console.log(allTransactions);
      setAllApprovedTxns(allTransactions);

      console.log("All Approved Transactions:", allTransactions);
    } catch (error) {
      console.error("Error viewing all transactions:", error);
    }
  };

  return (
    <NextUIProvider navigate={navigate}>
      <main className="dark text-foreground bg-background">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                allGroups={allGroups}
                getAllGroups={getAllGroups}
                createGroup={createGroup}
                joinGroup={joinGroup}
                connectToMetaMask={connectToMetaMask}
                account={account}
                initializeContract={initializeContract}
              />
            }
          />
          <Route
            path="/group/:groupIndex"
            element={
              <GroupPage
                contract={contract}
                addTransaction={addTransaction}
                voteOnTransaction={voteOnTransaction}
                viewAllPendingTransactions={viewAllPendingTransactions}
                viewAllApprovedTransactions={viewAllApprovedTransactions}
                allGroups={allGroups}
                allPendingTxns={allPendingTxns}
                allApprovedTxns={allApprovedTxns}
                account={account}
              />
            }
          />
        </Routes>
      </main>
    </NextUIProvider>

    // <div>
    //   <h1>Test Contract Interaction</h1>
    //   <button onClick={getGroupCount}>Get Group Count</button>
    //   <p>Group Count: {groupCount}</p>
    //   <button onClick={getAllGroups}>Get All Groups</button>
    //   {allGroups.map((group, index) => (
    //     <div key={index}>
    //       <h3>{group.name}</h3>
    //       <p>Minimum Stake Amount: {group.minimumStakeAmount} wei</p>
    //       <p>Members:</p>
    //       <ul>
    //         {group.members.map((member, memberIndex) => (
    //           <li key={memberIndex}>
    //             {member} - {group.nicknames[memberIndex]} (Paid:{" "}
    //             {group.amountsPaid[memberIndex]} wei)
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   ))}
    //   <h2>Create Group</h2>
    //   <input
    //     type="text"
    //     placeholder="Group Name"
    //     value={groupName}
    //     onChange={(e) => setGroupName(e.target.value)}
    //   />
    //   <input
    //     type="number"
    //     placeholder="Minimum Stake Amount (in Ether)"
    //     value={minimumStakeAmount}
    //     onChange={(e) => setMinimumStakeAmount(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Username"
    //     value={username}
    //     onChange={(e) => setUsername(e.target.value)}
    //   />
    //   <button onClick={createGroup}>Create Group</button>
    //   <h2>Join Group</h2>
    //   <input
    //     type="number"
    //     placeholder="Group Index"
    //     value={groupIndex}
    //     onChange={(e) => setGroupIndex(e.target.value)}
    //   />
    //   <button onClick={joinGroup}>Join Group</button>
    //   <h2>Add Transaction</h2>
    //   <input
    //     type="number"
    //     placeholder="Group Index"
    //     value={groupIndex}
    //     onChange={(e) => setGroupIndex(e.target.value)}
    //   />
    //   <input
    //     type="text"
    //     placeholder="Description"
    //     value={description}
    //     onChange={(e) => setDescription(e.target.value)}
    //   />
    //   <input
    //     type="number"
    //     placeholder="Amount"
    //     value={amount}
    //     onChange={(e) => setAmount(e.target.value)}
    //   />
    //   <button onClick={addTransaction}>Add Transaction</button>
    //   <h2>Vote on Transaction</h2>
    //   <input
    //     type="number"
    //     placeholder="Group Index"
    //     value={groupIndex}
    //     onChange={(e) => setGroupIndex(e.target.value)}
    //   />
    //   <input
    //     type="number"
    //     placeholder="Transaction Index"
    //     value={transactionIndex}
    //     onChange={(e) => setTransactionIndex(e.target.value)}
    //   />
    //   <input
    //     type="checkbox"
    //     checked={inFavor}
    //     onChange={(e) => setInFavor(e.target.checked)}
    //   />
    //   <label>Vote in Favor</label>
    //   <button onClick={voteOnTransaction}>Vote on Transaction</button>
    //   <h2>View All Transactions</h2>
    //   <input
    //     type="number"
    //     placeholder="Group Index"
    //     value={groupIndex}
    //     onChange={(e) => setGroupIndex(e.target.value)}
    //   />
    //   <button onClick={viewAllTransactions}>View All Transactions</button>
    //   <div>All transaction for group index : {groupIndex}</div>
    //   {allTxns.map((txn, index) => (
    //     <div key={index}>
    //       <h3>{txn.description}</h3>
    //       <p>Amount: {txn.amount}</p>
    //       <p>Sender: {txn.sender}</p>
    //       <p>Votes in Favor: {txn.votesInFavor}</p>
    //       <p>Votes Against: {txn.votesAgainst}</p>
    //     </div>
    //   ))}
    // </div>
  );
}

export default App;
