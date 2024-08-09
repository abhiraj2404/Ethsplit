import React, { useState } from "react";
import GroupCard from "../components/GroupCard";
import { Button } from "@nextui-org/react";
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

function Home({
  allGroups,
  getAllGroups,
  createGroup,
  joinGroup,
  connectToMetaMask,
  account,
  initializeContract,
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [groupName, setGroupName] = useState("");
  const [minimumStakeAmount, setMinimumStakeAmount] = useState(0);
  const [username, setUsername] = useState("");

  return (
    <>
      <div className="w-full h-screen bg-black p-4 flex flex-col items-center">
        <h1 className="font-bold text-white text-5xl my-5 flex flex-row justify-center">
          Welcome to <span className="text-blue-400 ml-3"> EthSplit</span>
        </h1>
        {account ? (
          <div className="flex gap-5 items-center">
            <Button color="success">Connected</Button>
            <div className="text-xl">{`Account: ${account.slice(
              0,
              6
            )}...${account.slice(-4)}`}</div>
          </div>
        ) : (
          <Button color="primary" onClick={connectToMetaMask}>
            Connect to MetaMask
          </Button>
        )}

        <div className="w-[80%] mt-10">
          <Button color="primary" onClick={getAllGroups} className="mb-10">
            Get all data
          </Button>

          <Button onPress={onOpen} color="primary" className="ml-5">
            Create new Group
          </Button>
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
                      label="Group Name"
                      labelPlacement="outside"
                      placeholder="Enter your Group name"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                    />
                    <Input
                      type="number"
                      label="Stake Amount"
                      placeholder="0.00"
                      labelPlacement="outside"
                      value={minimumStakeAmount}
                      onChange={(e) => setMinimumStakeAmount(e.target.value)}
                      startContent={
                        <div className="pointer-events-none flex items-center">
                          <span className="text-default-400 text-small">
                            ETH
                          </span>
                        </div>
                      }
                    />
                    <Input
                      type="text"
                      label="Username"
                      labelPlacement="outside"
                      placeholder="Enter your Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="primary"
                      onPress={() => {
                        onClose();
                        createGroup(groupName, minimumStakeAmount, username);
                      }}
                    >
                      Create
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
          <div className="grid grid-cols-3 gap-10 mb-10">
            {allGroups.map((group, groupIndex) => {
              return (
                <GroupCard
                  key={groupIndex}
                  name={group.name}
                  minimumStakeAmount={group.minimumStakeAmount}
                  members={group.members}
                  nicknames={group.nicknames}
                  amountsPaid={group.amountsPaid}
                  groupIndex={groupIndex}
                  joinGroup={joinGroup}
                />
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
