// SPDX-License-Identifier: MIT
pragma solidity ^0.8.12;

contract TestContract {
    uint256 public value = 0;
    
    function setValue(uint256 _value) public {
        value = _value;
    }
}
