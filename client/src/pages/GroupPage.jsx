import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Button } from "@nextui-org/react";
import { ethers } from "ethers";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from "@nextui-org/react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Checkbox,
  Input,
  Link,
} from "@nextui-org/react";

function GroupPage({
  contract,
  addTransaction,
  voteOnTransaction,
  viewAllPendingTransactions,
  viewAllApprovedTransactions,
  allGroups,
  allPendingTxns,
  allApprovedTxns,
  account,
}) {
  const params = useParams();
  const groupIndex = parseInt(params.groupIndex);
  const groupData = allGroups[groupIndex];
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [hasVotedArray, setHasVotedArray] = useState([]);

  useEffect(() => {
    viewAllPendingTransactions(groupIndex);
    viewAllApprovedTransactions(groupIndex);
  }, []);

  const hasVoted = async (groupIndex, transactionIndex, sender) => {
    const vote = await contract.hasVoted(groupIndex, transactionIndex, sender);
    return vote;
  };

  const votingArray = async () => {
    const hasVotedArray = [];
    for (let i = 0; i < allPendingTxns.length; i++) {
      const res = await hasVoted(groupIndex, i, account);
      hasVotedArray.push(res);
    }
    setHasVotedArray(hasVotedArray);
  };

  useEffect(() => {
    votingArray();
  }, [allPendingTxns]);

  console.log(hasVotedArray);

  return (
    <div className="bg-gray-900 w-full flex flex-col p-10 items-center">
      <div className="bg-gray-900 w-[70%] p-10 rounded-xl">
        <div className="p-4 mx-auto max-w-screen-xl lg:py-8 lg:px-6 ">
          <div className="max-w-screen-lg text-gray-500 sm:text-lg dark:text-gray-300 flex flex-col gap-5">
            <div className="flex flex-row justify-between items-center border-b-1 border-gray-300">
              <h2 className="mb-4 text-4xl tracking-tight font-bold">
                Group Name - <span className="font-bold">{groupData.name}</span>{" "}
              </h2>
              <p className="mb-4 font-bold text-3xl">
                Stake Amount: {groupData.minimumStakeAmount} ETH
              </p>
            </div>
            <div className="mt-10 font-semibold text-xl">
              <h1 className="font-bold text-2xl text-blue-400">
                DESCRIPTION :{" "}
              </h1>
              Here are the biggest enterprise technology acquisitions of 2021 so
              far, in reverse chronological order.
            </div>
            <div>
              <h1 className="font-bold text-2xl text-blue-400 mt-4 mb-2">
                MEMBERS : {groupData.members.length}
              </h1>
              <ul className="flex flex-col ml-4 list-disc">
                {groupData.members.map((member, memberIndex) => (
                  <li key={memberIndex}>
                    {member} -{" "}
                    <span className="font-bold">
                      {" "}
                      {groupData.nicknames[memberIndex]} (Paid:{" "}
                      {groupData.amountsPaid[memberIndex]} ETH){" "}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col gap-6">
              <div className="flex flex-row justify-between p-10 items-center">
                <h1 className="text-3xl font-bold mt-5">TRANSACTIONS </h1>
                <div className="flex flex-row gap-3">
                  <Button
                    color="primary"
                    className=""
                    onPress={() => {
                      viewAllApprovedTransactions(groupIndex);
                      viewAllPendingTransactions(groupIndex);
                      votingArray();
                    }}
                  >
                    Refresh
                  </Button>
                  <Button color="primary" className="" onPress={onOpen}>
                    Add a transaction
                  </Button>
                </div>
                <Modal
                  isOpen={isOpen}
                  onOpenChange={onOpenChange}
                  placement="top-center"
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Create new Group
                        </ModalHeader>
                        <ModalBody className="flex flex-col gap-5">
                          <Input
                            type="text"
                            label="Description"
                            labelPlacement="outside"
                            placeholder="Enter description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                          />
                          <Input
                            type="number"
                            label="Amount"
                            placeholder="0.00"
                            labelPlacement="outside"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            startContent={
                              <div className="pointer-events-none flex items-center">
                                <span className="text-default-400 text-small">
                                  WEI
                                </span>
                              </div>
                            }
                          />
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="flat"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onPress={() => {
                              onClose();
                              addTransaction(groupIndex, description, amount);
                            }}
                          >
                            Create
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>
              </div>
              <div>
                <h1 className="mb-3 text-2xl italic text-center">
                  Approved Transactions
                </h1>
                <Table aria-label="Example empty table">
                  <TableHeader>
                    <TableColumn>ID </TableColumn>
                    <TableColumn>USER</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>VOTES IN FAVOR</TableColumn>
                  </TableHeader>
                  <TableBody emptyContent={"No rows to display."}>
                    {allApprovedTxns.map((txn, txnIndex) => {
                      const indexofsender = groupData.members.indexOf(
                        txn.sender
                      );
                      const nickname = groupData.nicknames[indexofsender];

                      return (
                        <TableRow key={txnIndex + 1}>
                          <TableCell>{txnIndex + 1}</TableCell>
                          <TableCell>{nickname}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell>{txn.amount}</TableCell>
                          <TableCell>{txn.votesInFavor}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div>
                <h1 className="mb-3 text-2xl italic text-center">
                  Pending Transactions ...
                </h1>
                <Table aria-label="Example static collection table">
                  <TableHeader>
                    <TableColumn>ID </TableColumn>
                    <TableColumn>USER</TableColumn>
                    <TableColumn>DESCRIPTION</TableColumn>
                    <TableColumn>AMOUNT</TableColumn>
                    <TableColumn>ACTIONS</TableColumn>
                  </TableHeader>
                  <TableBody>
                    {allPendingTxns.map((txn, txnIndex) => {
                      const indexofsender = groupData.members.indexOf(
                        txn.sender
                      );
                      const nickname = groupData.nicknames[indexofsender];

                      return (
                        <TableRow key={txnIndex + 1}>
                          <TableCell>{txnIndex + 1}</TableCell>
                          <TableCell>{nickname}</TableCell>
                          <TableCell>{txn.description}</TableCell>
                          <TableCell>{txn.amount}</TableCell>
                          <TableCell>
                            {hasVotedArray[txnIndex] ? (
                              <div>Already Voted</div>
                            ) : (
                              <div className="flex flex-row gap-2">
                                <Tooltip content="Vote in favor">
                                  <span
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                    onClick={() => {
                                      voteOnTransaction(
                                        groupIndex,
                                        txnIndex,
                                        true
                                      );
                                      votingArray();
                                    }}
                                  >
                                    <svg
                                      className="w-6 h-6 text-gray-800 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm13.707-1.293a1 1 0 0 0-1.414-1.414L11 12.586l-1.793-1.793a1 1 0 0 0-1.414 1.414l2.5 2.5a1 1 0 0 0 1.414 0l4-4Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                </Tooltip>

                                <Tooltip content="Vote Against">
                                  <span
                                    className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                    onClick={() => {
                                      voteOnTransaction(
                                        groupIndex,
                                        txnIndex,
                                        false
                                      );
                                      votingArray();
                                    }}
                                  >
                                    <svg
                                      className="w-6 h-6 text-gray-800 dark:text-white"
                                      aria-hidden="true"
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="24"
                                      height="24"
                                      fill="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm7.707-3.707a1 1 0 0 0-1.414 1.414L10.586 12l-2.293 2.293a1 1 0 1 0 1.414 1.414L12 13.414l2.293 2.293a1 1 0 0 0 1.414-1.414L13.414 12l2.293-2.293a1 1 0 0 0-1.414-1.414L12 10.586 9.707 8.293Z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </span>
                                </Tooltip>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
              <div className="flex justify-center mt-6">
                {allApprovedTxns.length > 0 ? (
                  <Button color="primary">Settle Transactions</Button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupPage;
