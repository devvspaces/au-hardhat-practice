// SPDX-License-Identifier: MIT 
pragma solidity 0.8.4;

contract Faucet {

  address payable public owner;

  struct User {
    uint amount;
    uint lastSent;
  }

  mapping(address => User) public sents;

  constructor () payable {
    owner = payable(msg.sender);
  }

  function withdraw(uint _amount) public {
    require(_amount <= 100000000000000000, "You can only withdraw .1 ETH at a time");
    require(block.timestamp - sents[msg.sender].lastSent >= 5 minutes, "You can only withdraw once every 5 minutes");
    (bool s, ) = payable(msg.sender).call{ value: _amount }("");
    require(s, "Withdraw failed");
    sents[msg.sender].amount += _amount;
    sents[msg.sender].lastSent = block.timestamp;
  }

  function withdrawAll() external onlyOwner {
    (bool s, ) = owner.call{ value: address(this).balance }("");
    require(s, "Withdraw failed");
  }

  function destroyFaucet() external onlyOwner {
    selfdestruct(owner);
  }

  modifier onlyOwner {
    require(msg.sender == owner);
    _;
  }

  // fallback function
  receive() external payable {}
}