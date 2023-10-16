// SPDX-License-Identifier: MIT 
pragma solidity 0.8.4;

contract Faucet {

  address public owner;

  struct User {
    uint amount;
    uint lastSent;
  }

  mapping(address => User) public sents;

  constructor () payable {
    owner = msg.sender;
  }

  function withdraw(uint _amount) public {
    // users can only withdraw .1 ETH at a time, feel free to change this!
    require(_amount <= 100000000000000000, "You can only withdraw .1 ETH at a time");
    require(block.timestamp - sents[msg.sender].lastSent >= 5 minutes, "You can only withdraw once every 5 minutes");
    payable(msg.sender).transfer(_amount);
    sents[msg.sender].amount += _amount;
    sents[msg.sender].lastSent = block.timestamp;
  }

  // fallback function
  receive() external payable {}
}