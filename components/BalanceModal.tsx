import React from 'react';
import { CloseIcon, BanknotesIcon } from './icons';

interface BalanceModalProps {
    balance: number;
    onClose: () => void;
}

const BalanceModal: React.FC<BalanceModalProps> = ({ balance, onClose }) => {
    
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="relative w-full max-w-sm p-8 mx-4 text-center bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute text-gray-500 top-4 right-4 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <div className="flex justify-center mb-4">
                     <BanknotesIcon className="w-12 h-12 text-primary"/>
                </div>
                <h2 className="text-lg font-medium text-gray-600 dark:text-gray-300">Main Account Balance</h2>
                <p className="mt-2 text-4xl font-bold text-gray-800 dark:text-white">{formatCurrency(balance)}</p>
                <p className="mt-4 text-xs text-gray-500 dark:text-gray-400">This is your current available balance.</p>
            </div>
        </div>
    );
};

export default BalanceModal;