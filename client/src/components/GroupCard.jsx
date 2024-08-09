import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Button,
} from "@nextui-org/react";

function GroupCard({
  name,
  minimumStakeAmount,
  members,
  nicknames,
  amountsPaid,
  groupIndex,
  joinGroup,
}) {
  const navigate = useNavigate();
  const handleGroupClick = () => {
    navigate(`/group/${groupIndex}`);
  };
  const [username, setUsername] = useState("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className=" max-w-sm p-6 border rounded-lg shadow bg-gray-800 border-gray-700">
      <div onClick={handleGroupClick} className="cursor-pointer">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-white">
          {name}
        </h5>
      </div>
      <p className="mb-3 font-normal text-gray-400">
        Here are the biggest enterprise technology acquisitions of 2021 so far,
        in reverse chronological order.
      </p>
      <p className="mb-3 font-bold text-gray-300">
        Stake Amount: {minimumStakeAmount} ETH
      </p>
      <p className="mb-3 font-semibold text-gray-300">
        <span className="font-bold">Members</span>:{" "}
        {nicknames.map((nickname, index) => {
          return (
            <span key={index}>
              {nickname} {index == nicknames.length - 1 ? "" : ", "}
            </span>
          );
        })}
      </p>
      <Button
        onPress={onOpen}
        color="primary"
        className="inline-flex items-center text-center  px-3 py-2"
      >
        Join Group
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Join Group
              </ModalHeader>
              <ModalBody className="flex flex-col gap-5">
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
                    joinGroup(groupIndex, minimumStakeAmount, username);
                  }}
                >
                  Join
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default GroupCard;
