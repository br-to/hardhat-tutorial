'use client';
import { useState } from 'react';
import { ethers } from 'ethers';
import abi from '@/abi/Token.sol/Token.json';

// デプロイ後のアドレスを設定
const TOKEN_ADDRESS = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

export default function Home() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const connectWallet = async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      await getBalance(accounts[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const getBalance = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(TOKEN_ADDRESS, abi.abi, provider);
      const balance = await contract.balanceOf(address);
      setBalance(balance.toString());
    } catch (error) {
      console.error(error);
    }
  };

  const handleTransfer = async () => {
    try {
      setLoading(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);

      const tx = await contract.transfer(recipient, amount);
      await tx.wait();

      await getBalance(account);
      setRecipient('');
      setAmount('');
    } catch (error) {
      alert(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-md mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center">My Token App</h1>

        {!account ? (
          <button
            onClick={connectWallet}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            type="button"
          >
            Connect Wallet
          </button>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-sm text-gray-600">Connected Account</p>
              <p className="font-mono">{account}</p>
              <p className="mt-2 text-sm text-gray-600">Balance</p>
              <p className="font-bold">{balance} MHT</p>
            </div>

            <div className="space-y-4">
              <input
                type="text"
                placeholder="Recipient Address"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-2 border rounded text-black"
              />
              <button
                onClick={handleTransfer}
                disabled={loading}
                className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 disabled:bg-gray-400"
                type="button"
              >
                {loading ? 'Processing...' : 'Transfer'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
