import React, { useState } from 'react';
import { CloseIcon } from './icons';

interface WithdrawModalProps {
  onClose: () => void;
  onWithdraw: (amount: number) => void;
  totalSaved: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, onWithdraw, totalSaved }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleWithdraw = () => {
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (numericAmount > totalSaved) {
      setError('Withdrawal amount cannot exceed your total savings.');
      return;
    }
    onWithdraw(numericAmount);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute text-gray-500 top-3 right-3 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Withdraw Savings</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Move funds from your savings pot to your main account.
        </p>

        <div className="mt-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount to Withdraw (₹)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
            placeholder="0.00"
          />
        </div>

        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        
        <button
          onClick={handleWithdraw}
          className="w-full px-4 py-2 mt-6 font-semibold text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Confirm Withdraw
        </button>
      </div>
    </div>
  );
};

export default WithdrawModal;
