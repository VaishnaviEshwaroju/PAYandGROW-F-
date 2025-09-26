import React, { useState } from 'react';
import { CloseIcon } from './icons';

interface PaymentModalProps {
  onClose: () => void;
  onPayment: (amount: number, vendor: string, multiplier: number) => void;
  accountBalance: number;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onPayment, accountBalance }) => {
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [error, setError] = useState('');
  const [multiplier, setMultiplier] = useState(1);

  const MULTIPLIER_THRESHOLD = 10000;
  const showMultiplier = accountBalance > MULTIPLIER_THRESHOLD;

  const handlePayment = () => {
    const numericAmount = parseFloat(amount);
    if (!vendor) {
      setError('Please enter a recipient or vendor.');
      return;
    }
    if (isNaN(numericAmount) || numericAmount <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    
    const baseSavings = (Math.ceil(numericAmount / 10) * 10) - numericAmount;
    const actualSavings = baseSavings > 0 ? baseSavings * multiplier : 0;
    const totalDeduction = numericAmount + actualSavings;

    if (totalDeduction > accountBalance) {
      setError('Insufficient funds for this transaction and boosted saving.');
      return;
    }

    onPayment(numericAmount, vendor, multiplier);
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
      <div className="relative w-full max-w-sm p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute text-gray-500 top-3 right-3 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
          <CloseIcon className="w-6 h-6" />
        </button>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Make a Payment</h2>
        
        <div className="mt-4">
          <label htmlFor="vendor" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Recipient / Vendor
          </label>
          <input
            type="text"
            id="vendor"
            value={vendor}
            onChange={(e) => setVendor(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
            placeholder="e.g., Coffee Shop"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Amount (₹)
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

        {showMultiplier && (
          <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Savings Multiplier
              </label>
              <div className="flex mt-2 rounded-lg shadow-sm">
                  {[1, 2, 3].map((m) => (
                      <button
                          key={m}
                          type="button"
                          onClick={() => setMultiplier(m)}
                          className={`flex-1 px-4 py-2 text-sm font-medium border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary
                          ${m === 1 ? 'rounded-l-lg' : ''}
                          ${m === 3 ? 'rounded-r-lg' : ''}
                          ${multiplier === m
                              ? 'bg-primary text-white border-primary'
                              : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600'
                          }`}
                      >
                          {m}x
                      </button>
                  ))}
              </div>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Boost your savings on this transaction!</p>
          </div>
        )}


        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        
        <button
          onClick={handlePayment}
          className="w-full px-4 py-2 mt-6 font-semibold text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Pay Now
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;