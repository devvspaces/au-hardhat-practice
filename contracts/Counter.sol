// SPDX-License-Identifier: MIT 
pragma solidity 0.8.4;

contract Counter {
  uint public count;

  // Function to get count
  function get() public view returns (uint) {
    return count;
  }

  // Function to increment count by 1
  function inc() public {
    count++;
  }

  // Function to decrement count by 1
  function dec() public {
    count--;
  }
}