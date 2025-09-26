import React from 'react';
import { Transaction } from '../types';

interface TransactionsPageProps {
    transactions: Transaction[];
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions }) => {
    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    return (
        <div className="p-4">
            <header className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Transaction History</h1>
            </header>
            <div className="space-y-3">
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <div key={tx.id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                            <div>
                                <p className="font-semibold text-gray-900 dark:text-white">{tx.vendor}</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleString()}</p>
                            </div>
                            <div className="text-right">
                                {tx.type === 'payment' ? (
                                    <>
                                        <p className="font-bold text-red-500">-{formatCurrency(tx.amount)}</p>
                                        {tx.roundedAmount && tx.roundedAmount > 0 && 
                                            <p className="text-xs text-primary">
                                                + {formatCurrency(tx.roundedAmount)} saved {tx.multiplier && tx.multiplier > 1 ? `(${tx.multiplier}x)` : ''}
                                            </p>
                                        }
                                    </>
                                ) : (
                                    <p className="font-bold text-green-500">+{formatCurrency(tx.amount)}</p>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="mt-8 text-center text-gray-500 dark:text-gray-400">No transactions yet.</p>
                )}
            </div>
        </div>
    );
};

export default TransactionsPage;