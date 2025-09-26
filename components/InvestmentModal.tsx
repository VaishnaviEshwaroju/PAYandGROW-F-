import React, { useState, useEffect } from 'react';
import { getInvestmentSuggestions } from '../services/geminiService';
import { InvestmentSuggestion } from '../types';
import { CloseIcon } from './icons';

interface InvestmentModalProps {
    onClose: () => void;
}

const InvestmentModal: React.FC<InvestmentModalProps> = ({ onClose }) => {
    const [suggestions, setSuggestions] = useState<InvestmentSuggestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getInvestmentSuggestions();
                setSuggestions(result);
            } catch (err) {
                setError("Could not fetch investment suggestions. Please try again later.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchSuggestions();
    }, []);

    const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
        switch(risk) {
            case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60" onClick={onClose}>
            <div className="relative w-full max-w-lg p-6 mx-4 bg-white rounded-lg shadow-xl dark:bg-gray-800" onClick={e => e.stopPropagation()}>
                <button onClick={onClose} className="absolute text-gray-500 top-4 right-4 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white">
                    <CloseIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Grow Your Savings</h2>
                <p className="mt-1 text-gray-600 dark:text-gray-400">Here are some beginner-friendly ideas to make your money work for you.</p>

                <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {loading && (
                        <div className="flex justify-center items-center h-40">
                            <div className="w-8 h-8 border-4 rounded-full border-primary border-t-transparent animate-spin"></div>
                        </div>
                    )}
                    {error && <p className="text-center text-red-500">{error}</p>}
                    {!loading && !error && suggestions.map((item, index) => (
                        <div key={index} className="p-4 border rounded-lg dark:border-gray-700">
                             <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-gray-900 dark:text-white">{item.name}</h3>
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${getRiskColor(item.riskLevel)}`}>
                                    {item.riskLevel} Risk
                                </span>
                            </div>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                            <p className="mt-2 text-xs font-mono text-gray-500 dark:text-gray-500">Type: {item.type}</p>
                        </div>
                    ))}
                </div>
                 <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">Disclaimer: This is not financial advice. Do your own research.</p>
            </div>
        </div>
    );
};

export default InvestmentModal;