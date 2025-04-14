'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import abi from '@/abi/Token.sol/Token.json';

// コントラクトのデプロイ後のアドレスを設定
const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function Home() {
  // アカウントのアドレスを保持するstate
  const [account, setAccount] = useState('');
  // トークン残高を保持するstate
  const [balance, setBalance] = useState('0');
  // 送金先アドレスを保持するstate
  const [recipient, setRecipient] = useState('');
  // 送金額を保持するstate
  const [amount, setAmount] = useState('');
  // 送金処理中か
  const [loading, setLoading] = useState(false);

  // MetaMaskとの接続を行う関数
  const connectWallet = async () => {
    try {
      // MetaMaskからアカウントへのアクセスを要求
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      // 接続されたアカウントを保存
      setAccount(accounts[0]);
      // 残高を取得
      await getBalance(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  // 指定アドレスのトークン残高を取得する関数
  const getBalance = async (address: string) => {
    try {
      // MetaMaskのプロバイダーを取得
      const provider = new ethers.BrowserProvider(window.ethereum);
      // コントラクトのインスタンスを作成
      const contract = new ethers.Contract(TOKEN_ADDRESS, abi.abi, provider);
      // balanceOf関数を呼び出してトークン残高を取得
      const balance = await contract.balanceOf(address);
      setBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };

  // トークンを送金する関数
  const handleTransfer = async () => {
    try {
      setLoading(true);
      // MetaMaskのプロバイダーとSignerを取得
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      // 書き込み用のコントラクトインスタンスを作成
      const contract = new ethers.Contract(TOKEN_ADDRESS, abi.abi, signer);

      // transfer関数を呼び出してトークンを送金
      const tx = await contract.transfer(recipient, amount);
      // トランザクションの完了を待機
      await tx.wait();

      // 送金後の残高を更新
      await getBalance(account);
      // フォームをリセット
      setRecipient('');
      setAmount('');
    } catch (error) {
      // エラーメッセージをユーザーに表示
      alert(`トランザクションが失敗しました: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">トークンアプリ</h1>

        {/* ウォレット未接続の場合は接続ボタンを表示 */}
        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            type="button"
          >
            ウォレットを接続
          </button>
        ) : (
          // ウォレット接続済みの場合はトークン操作UIを表示
          <div className="space-y-6">
            {/* アカウント情報と残高の表示 */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">接続中のアカウント</p>
              <p className="font-mono">{account}</p>
              <p className="mt-2 text-sm text-gray-600">残高</p>
              <p className="font-bold">{balance} MHT</p>
            </div>

            {/* 送金フォーム */}
            <div className="space-y-4">
              <input
                type="text"
                placeholder="送信先のアドレス"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="number"
                placeholder="送信するトークン数"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400 cursor-pointer"
                type="button"
              >
                {loading ? '送信中...' : 'トークンを送信'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
