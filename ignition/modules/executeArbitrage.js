const { ethers } = require("ethers");

async function executeArbitrage(
    providerUrl,
    privateKey,
    contractAddress,
    token0Address,
    token1Address,
    routerAddress, // Use the MockRouter address
    amountIn
) {
    const provider = new ethers.providers.JsonRpcProvider(providerUrl);
    const wallet = new ethers.Wallet(privateKey, provider);

    const abi = [
        "function arbitrage(address token0, address token1, address pool1, address pool2, uint amountIn) external",
        "function approve(address spender, uint256 amount) external returns (bool)",
    ];
    const contract = new ethers.Contract(contractAddress, abi, wallet);

    const token0Contract = new ethers.Contract(token0Address, ["function approve(address spender, uint256 amount) external returns (bool)"], wallet);

    const amountInBigNumber = ethers.BigNumber.from(amountIn);

    const approvalTx = await token0Contract.approve(contractAddress, amountInBigNumber);
    await approvalTx.wait();
    console.log(`Approved ${amountIn} of token0 for contract ${contractAddress}`);

    const tx = await contract.arbitrage(
        token0Address,
        token1Address,
        routerAddress, // MockRouter acts as pool1
        routerAddress, // MockRouter acts as pool2
        amountIn
    );
    console.log("Arbitrage transaction hash:", tx.hash);
    const receipt = await tx.wait();
    console.log("Arbitrage transaction confirmed in block:", receipt.blockNumber);
    console.log("Arbitrage executed!");

    const token0ContractArbitrage = new ethers.Contract(token0Address, ["function balanceOf(address) external view returns (uint256)"], provider);
    const finalBalance = await token0ContractArbitrage.balanceOf(contractAddress);
    console.log("Final balance of Token0 in Arbitrage contract:", finalBalance.toString());

}

// Example Usage
const providerUrl = "http://127.0.0.1:8545"; // Hardhat default
const privateKey = "0xac0974bec39a17e36301c5ab3c8b4f50995c468099527e7d37d1407a33b80735";  // Hardhat default private key
const contractAddress = "0xYourArbitrageContractAddress"; // Replace with deployed address
const token0Address = "0xYourTokenAAddress";       // Replace
const token1Address = "0xYourTokenBAddress";       // Replace
const routerAddress = "0xYourMockRouterAddress";     // Replace
const amountIn = ethers.utils.parseUnits("1", 18);    // 1 Token0

executeArbitrage(
    providerUrl,
    privateKey,
    contractAddress,
    token0Address,
    token1Address,
    routerAddress,
    amountIn
).catch(error => {
    console.error("Error:", error);
    process.exit(1);
});
