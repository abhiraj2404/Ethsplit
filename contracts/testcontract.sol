// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TestContract {
    // Define a Group struct
    struct Group {
        string name;
        uint256 minimumStakeAmount;
        address[] members;
        mapping(address => string) nickname;
        mapping(address => uint256) amountPaid;
        mapping(uint256 => Transaction) pendingTransactions;
        uint256 pendingTransactionsCount;
        Transaction[] approvedTransactions;
        uint256 approvedTransactionsCount;
    }

     // Define a Transaction struct
    struct Transaction {
        string description;
        uint256 amount;
        address sender;
        uint256 votesInFavor;
        uint256 votesAgainst;
    }
    mapping(uint256 => mapping(uint256 => mapping(address => bool))  ) public hasVoted;

    // Array to store all groups
    Group[] public groups;
    
     function etherToWei(uint256 amountInEther) internal pure returns (uint256) {
        return amountInEther * 1e18; // 1 Ether = 10^18 wei
    }

    function createGroup(string memory _name, uint256 _minimumStakeAmountInEther , string memory _username) public payable {
        uint256 minimumStakeAmountInWei = etherToWei(_minimumStakeAmountInEther);
        require(msg.value >= minimumStakeAmountInWei, "Insufficient stake amount to create group");

        // Create a new group and save it to storage
        Group storage newGroup = groups.push();
        newGroup.name = _name;
        newGroup.minimumStakeAmount = minimumStakeAmountInWei;
        newGroup.members.push(msg.sender); // Add the sender's address to the members array
        newGroup.nickname[msg.sender] = _username;
        newGroup.amountPaid[msg.sender] = msg.value; // Record the stake amount paid by the sender
    }

   // Function to allow a user to join an existing group
    function joinGroup(uint _groupIndex , string memory _username) public payable {
        require(_groupIndex < groups.length, "Group does not exist");
        
        Group storage group = groups[_groupIndex];
        require(msg.value >= group.minimumStakeAmount, "Insufficient stake amount to join group");

        // Check if the user is already a member of the group
        for (uint i = 0; i < group.members.length; i++) {
            require(group.members[i] != msg.sender, "You are already a member of this group");
        }

        // Add the user to the group's members array
        group.members.push(msg.sender);
        group.nickname[msg.sender] = _username;
        group.amountPaid[msg.sender] = msg.value; // Record the stake amount paid by the sender
    }

    function addTransaction(uint _groupIndex, string memory _description, uint256 _amount) public {
        require(_groupIndex < groups.length, "Group does not exist");
        Group storage group = groups[_groupIndex];
        require(group.amountPaid[msg.sender] > 0, "Only group members can add transactions");

        uint256 transactionIndex = groups[_groupIndex].pendingTransactionsCount;
        groups[_groupIndex].pendingTransactions[transactionIndex].description = _description;
        groups[_groupIndex].pendingTransactions[transactionIndex].amount = _amount;
        groups[_groupIndex].pendingTransactions[transactionIndex].sender = msg.sender;
        groups[_groupIndex].pendingTransactions[transactionIndex].votesInFavor = 1;
        groups[_groupIndex].pendingTransactionsCount++;

        hasVoted[_groupIndex][transactionIndex][msg.sender] = true;
    }

    function voteOnTransaction(uint _groupIndex, uint _transactionIndex, bool _inFavor) public {
        require(_groupIndex < groups.length, "Group does not exist");
        Group storage group = groups[_groupIndex];
        require(group.amountPaid[msg.sender] > 0, "Only group members can vote");

        Transaction storage transaction = groups[_groupIndex].pendingTransactions[_transactionIndex];
       require(!hasVoted[_groupIndex][_transactionIndex][msg.sender], "You have already voted on this transaction");

    if (_inFavor) {
        transaction.votesInFavor++;
    } else {
        transaction.votesAgainst++;
    }
    hasVoted[_groupIndex][_transactionIndex][msg.sender] = true;

    // Check if the transaction has more than 50% votes in favor
    if (transaction.votesInFavor > groups[_groupIndex].members.length / 2) {
        // Move the transaction to approved transactions
        uint256 idx =  groups[_groupIndex].approvedTransactions.length;
        groups[_groupIndex].approvedTransactions.push();
        Transaction storage trans =  groups[_groupIndex].approvedTransactions[idx];
        trans.description = transaction.description;
        trans.amount = transaction.amount;
        trans.sender = transaction.sender;
        trans.votesInFavor = transaction.votesInFavor;
        trans.votesAgainst = transaction.votesAgainst;

        groups[_groupIndex].approvedTransactionsCount++;

        // Remove the transaction from pending transactions

           if (_transactionIndex < groups[_groupIndex].pendingTransactionsCount - 1) {
            // Move the last pending transaction to the deleted position
            groups[_groupIndex].pendingTransactions[_transactionIndex] = groups[_groupIndex].pendingTransactions[groups[_groupIndex].pendingTransactionsCount - 1];
        }
        delete groups[_groupIndex].pendingTransactions[groups[_groupIndex].pendingTransactionsCount - 1];
        groups[_groupIndex].pendingTransactionsCount--;
    }
    }

    

     function getGroupCount() public view returns (uint) {
        return groups.length;
    }

   // Function to get details of a specific group
    function getGroup(uint _index) public view returns (string memory, uint256, address[] memory, uint256[] memory, string[] memory) {
        require(_index < groups.length, "Group index out of bounds");
        Group storage group = groups[_index];

         uint256 memberCount = group.members.length;

    // Create an array to hold the amounts paid by each member
    uint256[] memory amountsPaid = new uint256[](memberCount);
    string[] memory nicknames = new string[](memberCount);

        for (uint i = 0; i < memberCount; i++) {
        address member = group.members[i];
        amountsPaid[i] = group.amountPaid[member];
        nicknames[i] = group.nickname[member];
    }
        
       

        return (group.name, group.minimumStakeAmount, group.members, amountsPaid, nicknames);
    }

   function getAllGroups() public view returns (string[] memory, uint256[] memory, address[][] memory, uint256[][] memory, string[][] memory) {
        uint groupCount = groups.length;

        string[] memory names = new string[](groupCount);
        uint256[] memory minimumStakeAmounts = new uint256[](groupCount);
        address[][] memory allMembers = new address[][](groupCount);
        uint256[][] memory allAmountsPaid = new uint256[][](groupCount);
        string[][] memory allnicknames = new string[][](groupCount);

        for (uint i = 0; i < groupCount; i++) {
            Group storage group = groups[i];
            names[i] = group.name;
            minimumStakeAmounts[i] = group.minimumStakeAmount;
            allMembers[i] = group.members;

            uint256[] memory amountsPaid = new uint256[](group.members.length);
            for (uint j = 0; j < group.members.length; j++) {
                amountsPaid[j] = group.amountPaid[group.members[j]];
            }
            allAmountsPaid[i] = amountsPaid;

            string[] memory nicknames = new string[](group.members.length);
            for (uint j = 0; j < group.members.length; j++) {
                nicknames[j] = group.nickname[group.members[j]];
            }
            allnicknames[i] = nicknames;

        }

        return (names, minimumStakeAmounts, allMembers, allAmountsPaid , allnicknames);
    }

   function viewAllPendingTransactions(uint _groupIndex) public view returns (string[] memory, uint256[] memory, address[] memory, uint256[] memory, uint256[] memory) {
    // ... other checks
    string[] memory descriptions = new string[](groups[_groupIndex].pendingTransactionsCount);
    uint256[] memory amounts = new uint256[](groups[_groupIndex].pendingTransactionsCount);
    address[] memory senders = new address[](groups[_groupIndex].pendingTransactionsCount);
    uint256[] memory votesInFavor = new uint256[](groups[_groupIndex].pendingTransactionsCount);
    uint256[] memory votesAgainst = new uint256[](groups[_groupIndex].pendingTransactionsCount);

    uint256 index = 0;
    for (uint i = 0; i < groups[_groupIndex].pendingTransactionsCount; i++) {
        Transaction storage txn = groups[_groupIndex].pendingTransactions[i];
        descriptions[index] = txn.description;
        amounts[index] = txn.amount;
        senders[index] = txn.sender;
        votesInFavor[index] = txn.votesInFavor;
        votesAgainst[index] = txn.votesAgainst;
        index++;
    }
    return (descriptions, amounts, senders, votesInFavor, votesAgainst);
}

 function viewAllApprovedTransactions(uint _groupIndex) public view returns (string[] memory, uint256[] memory, address[] memory, uint256[] memory, uint256[] memory) {
    // ... other checks
    string[] memory descriptions = new string[](groups[_groupIndex].approvedTransactionsCount);
    uint256[] memory amounts = new uint256[](groups[_groupIndex].approvedTransactionsCount);
    address[] memory senders = new address[](groups[_groupIndex].approvedTransactionsCount);
    uint256[] memory votesInFavor = new uint256[](groups[_groupIndex].approvedTransactionsCount);
    uint256[] memory votesAgainst = new uint256[](groups[_groupIndex].approvedTransactionsCount);

    uint256 index = 0;
    for (uint i = 0; i < groups[_groupIndex].approvedTransactionsCount; i++) {
        Transaction storage txn = groups[_groupIndex].approvedTransactions[i];
        descriptions[index] = txn.description;
        amounts[index] = txn.amount;
        senders[index] = txn.sender;
        votesInFavor[index] = txn.votesInFavor;
        votesAgainst[index] = txn.votesAgainst;
        index++;
    }

    return (descriptions, amounts, senders, votesInFavor, votesAgainst);
}

     
}