// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";

contract Token {
    // トークンの名前
    string public name = "My Hardhat Token";
    // トークンのシンボル
    string public symbol = "MHT";

    // トークンの固定供給量（uint256型の整数で保存）
    uint256 public totalSupply = 1000000;

    // イーサリアムアカウントを保存するためのアドレス型変数
    address public owner;

    // 各アカウントの残高を保持するマッピング
    mapping(address => uint256) balances;

		// イベントを定義 from(送信者アドレス) to(受信者アドレス) amount(送金額)
    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    // デプロイ時に一度だけ実行
    constructor() {
        // totalSupplyをコントラクトのデプロイアカウントに割り当てます。
        console.log("Deploying Token with total supply: %s and owner: %s", totalSupply, msg.sender);
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    // トークン送信用の関数
    function transfer(address to, uint256 amount) external {
        // 送信者が十分なトークンを持っているか確認します。
        // NOTE: unicodeを入れないとInvalid character in string literalエラーが出る
        require(balances[msg.sender] >= amount,unicode"トークンが不足しています");

        // トークンの送信
        balances[msg.sender] -= amount;
        balances[to] += amount;
        // イベントを発行 送金者、受取人、送金額がログに記録される
        emit Transfer(msg.sender, to, amount);
    }

    // 指定したアカウントのトークン残高を取得する関数
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
