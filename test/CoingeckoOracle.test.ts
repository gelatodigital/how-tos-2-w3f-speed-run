import hre from "hardhat";
import { expect } from "chai";
import { SimpleCounter } from "../typechain";
import { before } from "mocha";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import {
  Web3FunctionUserArgs,
  Web3FunctionResultV2,
} from "@gelatonetwork/web3-functions-sdk";
import { Web3FunctionHardhat } from "@gelatonetwork/web3-functions-sdk/hardhat-plugin";
const { ethers, deployments, w3f } = hre;

describe("SimpleCounter Tests", function () {
  this.timeout(0);

  let owner: SignerWithAddress;

  let oracle: SimpleCounter;
  let simpleW3f: Web3FunctionHardhat;
  let userArgs: Web3FunctionUserArgs;

  before(async function () {
    await deployments.fixture();

    [owner] = await hre.ethers.getSigners();

    oracle = await ethers.getContract("SimpleCounter");
    simpleW3f = w3f.get("simple");

    userArgs = {
      currency: "ethereum",
      oracle: oracle.address,
    };
  });

  it("canExec: true - First execution", async () => {
    let { result } = await simpleW3f.run({ userArgs });
    result = result as Web3FunctionResultV2;

    expect(result.canExec).to.equal(true);
    if (!result.canExec) throw new Error("!result.canExec");

    const initCounter = +(await oracle.counter()).toString();

    const calldataPrice = result.callData[0];
    await owner.sendTransaction({
      to: calldataPrice.to,
      data: calldataPrice.data,
    });

    const calldataIncrement = result.callData[1];
    await owner.sendTransaction({
      to: calldataIncrement.to,
      data: calldataIncrement.data,
    });

    const price = await oracle.price();
    console.log("> Price in contract: " +price.toString())
    expect(price).to.gt(0);

    const endCounter = +(await oracle.counter()).toString();
    expect(endCounter == initCounter + 1).true;
  });
});
