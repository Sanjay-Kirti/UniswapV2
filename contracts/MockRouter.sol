// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract MockRouter {
    uint public feeBasisPoints = 30; // 0.30% fee like Uniswap

    function getAmountsOut(uint amountIn, address[] memory path) external pure returns (uint[] memory amounts) {
        uint fee = (amountIn * 30) / 10000; // 0.30% fee simulation
        uint amountAfterFee = amountIn - fee;

        amounts = new uint[](path.length);
        amounts[0] = amountIn;

        for (uint i = 1; i < path.length; i++) {
            amountAfterFee = (amountAfterFee * 95) / 100; // 5% slippage
            amounts[i] = amountAfterFee;
        }
    }

    function swapExactTokensForTokensSupportingFeeOnTransferTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external {
       
    }
}
