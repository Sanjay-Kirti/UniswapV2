// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@uniswap/v2-periphery/contracts/interfaces/IUniswapV2Router02.sol";
import "@uniswap/v2-core/contracts/interfaces/IUniswapV2Pair.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract UniV2Arbitrage {
    address public owner;
    IUniswapV2Router02 public router;
    
    constructor(address _router) {
        owner = msg.sender;
        router = IUniswapV2Router02(_router);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not authorized");
        _;
    }

    function arbitrage(
        address token0,
        address token1,
        address pool1,
        address pool2,
        uint amountIn
    ) external onlyOwner {
        IERC20(token0).transferFrom(msg.sender, address(this), amountIn);
        IERC20(token0).approve(address(router), amountIn);

        address[] memory path1 = new address[](2);
        path1[0] = token0;
        path1[1] = token1;

        uint[] memory amountsOut1 = router.getAmountsOut(amountIn, path1);
        uint amountOut1 = amountsOut1[1];

        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            amountIn,
            0,
            path1,
            address(this),
            block.timestamp
        );

        uint token1Balance = IERC20(token1).balanceOf(address(this));
        IERC20(token1).approve(address(router), token1Balance);

        address[] memory path2 = new address[](2);
        path2[0] = token1;
        path2[1] = token0;

        uint[] memory amountsOut2 = router.getAmountsOut(token1Balance, path2);
        uint amountOut2 = amountsOut2[1];

        router.swapExactTokensForTokensSupportingFeeOnTransferTokens(
            token1Balance,
            0,
            path2,
            address(this),
            block.timestamp
        );

        uint finalBalance = IERC20(token0).balanceOf(address(this));
        require(finalBalance > amountIn, "No profit!");

        IERC20(token0).transfer(owner, finalBalance);
    }

    function withdrawTokens(address token) external onlyOwner {
        uint balance = IERC20(token).balanceOf(address(this));
        IERC20(token).transfer(owner, balance);
    }

    function withdrawETH() external onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    receive() external payable {}
}
