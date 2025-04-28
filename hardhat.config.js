require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

module.exports = {
    solidity: "0.8.19",
    networks: {
        // Use a local Hardhat network for testing
        hardhat: {
        },
        goerli: { // For real deployment (optional)
            url: process.env.GOERLI_URL || "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
        },
    },
};
