import hre, { deployments, getNamedAccounts } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";


const isHardhat = hre.network.name === "hardhat";

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  if (!isHardhat) {
    console.log(
      `\nDeploying SimpleCounter to ${hre.network.name}. Hit ctrl + c to abort`
    );
  
  }

  await deploy("SimpleCounter", {
    from: deployer,
    log: !isHardhat,
  });
};



func.tags = ["SimpleCounter"];

export default func;
