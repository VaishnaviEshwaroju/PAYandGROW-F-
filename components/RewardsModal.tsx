import React, { useState, useEffect } from 'react';
import { getRewardSuggestions } from '../services/ibmGraniteService';
import { RewardSuggestion, Transaction } from '../types';
import { CloseIcon, GiftIcon } from './icons';

interface RewardsModalProps {
    onClose: () => void;
    transactions: Transaction[];
}

const RewardsModal: React.FC<RewardsModalProps> = ({ onClose, transactions }) => {
    const [suggestions, setSuggestions] = useState<RewardSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRewards = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getRewardSuggestions(transactions);
                setSuggestions(result);
            } catch (err) {
                setError("Could not fetch rewards. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchRewards();
    }, [transactions]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="relative w-full max-w-md p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute text-gray-500 top-4 right-4 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <div className="flex items-center space-x-3">
                    <GiftIcon className="w-8 h-8 text-primary"/>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Personalized Rewards</h2>
                </div>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Based on your spending, here are some offers you might like.</p>

                <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && suggestions.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                             <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.vendor}</h3>
                                <span className="px-3 py-1 text-sm font-bold text-white rounded-full bg-primary">
                                    {item.offer}
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.details}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RewardsModal;
