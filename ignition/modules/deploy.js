const { ethers } = require("hardhat");

async function main() {
    const TokenA = await ethers.getContractFactory("MockERC20");
    const tokenA = await TokenA.deploy("TokenA", "TKA");
    await tokenA.deployed();
    console.log("TokenA deployed to:", tokenA.address);

    const TokenB = await ethers.getContractFactory("MockERC20");
    const tokenB = await TokenB.deploy("TokenB", "TKB");
    await tokenB.deployed();
    console.log("TokenB deployed to:", tokenB.address);

    
    const MockRouter = await ethers.getContractFactory("MockRouter");
    const mockRouter = await MockRouter.deploy();
    await mockRouter.deployed();
    console.log("MockRouter deployed to:", mockRouter.address);

    const UniV2Arbitrage = await ethers.getContractFactory("UniV2Arbitrage");
    const arbitrageContract = await UniV2Arbitrage.deploy(mockRouter.address);
    await arbitrageContract.deployed();
    console.log("UniV2Arbitrage deployed to:", arbitrageContract.address);

    console.log("\nDeployment complete.  Use these addresses in executeArbitrage.js:");
    console.log({
        tokenAAddress: tokenA.address,
        tokenBAddress: tokenB.address,
        mockRouterAddress: mockRouter.address,
        arbitrageContractAddress: arbitrageContract.address,
    });

    const initialAmount = ethers.utils.parseUnits("10", 18); // 10 tokens
    await tokenA.transfer(arbitrageContract.address, initialAmount);
    console.log(`Sent ${initialAmount} of TokenA to Arbitrage contract`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });