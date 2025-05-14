// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "hardhat/console.sol";

/// @title マイハードハットトークン (MHT)
/// @notice このコントラクトはデモンストレーション用の簡単なERC20トークンを実装します
/// @dev OpenZeppelinのERC20実装を継承しています
contract Token is ERC20 {
    /// @notice コントラクトオーナーのアドレス
    /// @dev コントラクトのデプロイ時に設定されます
    address public owner;

    /// @notice トークン名を"My Hardhat Token"、シンボルを"MHT"として初期化します
    /// @dev コントラクトのデプロイヤーに初期供給量をミントします
    constructor() ERC20("My Hardhat Token", "MHT") {
        owner = msg.sender;
        _mint(msg.sender, 1000000 * 10 ** decimals());
        console.log(totalSupply(), msg.sender);
    }
}
