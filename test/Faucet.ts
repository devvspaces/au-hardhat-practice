import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";

describe("Faucet", function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await ethers.getSigners();

    const Faucet = await ethers.getContractFactory("Faucet");
    const faucet = await Faucet.deploy();

    const FIVE_MINS_IN_SECS = 5 * 60;

    // send 1 ether to faucet
    const deposited = ethers.parseEther("1");
    await owner.sendTransaction({
      to: faucet.target,
      value: deposited,
    });

    return { faucet, owner, otherAccount, deposited, timer: FIVE_MINS_IN_SECS };
  }

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      const { faucet, owner } = await loadFixture(deployFixture);

      expect(await faucet.owner()).to.equal(owner.address);
    });

    it("Should have balance", async function () {
      const { faucet, deposited } = await loadFixture(deployFixture);
      expect(await ethers.provider.getBalance(faucet.target)).to.equal(
        deposited
      );
    });
  });

  describe("Withdrawal", function () {
    describe("Validations", function () {
      it("Should revert with the right error if withdrawing more than 0.1 eth", async function () {
        const { faucet, otherAccount } = await loadFixture(deployFixture);
        const amount = ethers.parseEther("0.11");
        await expect(
          faucet.connect(otherAccount).withdraw(amount)
        ).to.be.revertedWith("You can only withdraw .1 ETH at a time");
      });
    });

    describe("Transfers", function () {
      it("Should transfer the funds to the requester", async function () {
        const { faucet, otherAccount, timer } = await loadFixture(
          deployFixture
        );

        let amount = ethers.parseEther("0.01");

        await expect(
          faucet.connect(otherAccount).withdraw(amount)
        ).to.changeEtherBalance(otherAccount, amount);

        await expect(
          faucet.connect(otherAccount).withdraw(amount)
        ).to.be.revertedWith("You can only withdraw once every 5 minutes");

        await time.increase(timer);

        await expect(
          faucet.connect(otherAccount).withdraw(amount)
        ).to.changeEtherBalance(otherAccount, amount);
      });
      it("Should transfer all funds to owner", async function () {
        const { faucet, owner, deposited } = await loadFixture(deployFixture);

        await expect(faucet.connect(owner).withdrawAll()).to.changeEtherBalance(
          owner,
          deposited
        );
      });
    });
  });
});
