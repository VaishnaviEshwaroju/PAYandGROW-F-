import React, { useState } from 'react';
import { User } from '../types';
import InvestmentModal from './InvestmentModal';

interface InvestmentsPageProps {
    user: User;
}

const InvestmentsPage: React.FC<InvestmentsPageProps> = ({ user }) => {
    const [showInvestmentModal, setShowInvestmentModal] = useState(false);

     const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-4 text-center">
            <div className="w-full max-w-sm">
                 <div className="p-6 text-white rounded-lg shadow-lg bg-primary">
                    <p className="text-sm opacity-80">Total Savings Available to Invest</p>
                    <p className="mt-1 text-4xl font-bold">{formatCurrency(user.totalSaved)}</p>
                </div>
                <div className="mt-6">
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ready to Grow?</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Use your savings to explore investment options. Get beginner-friendly ideas to help your money grow over time.
                    </p>
                </div>
                <button
                    onClick={() => setShowInvestmentModal(true)}
                    className="w-full px-4 py-3 mt-8 font-bold text-white rounded-lg shadow-lg bg-primary-dark hover:bg-primary"
                >
                    Get Investment Ideas
                </button>
            </div>
            {showInvestmentModal && <InvestmentModal onClose={() => setShowInvestmentModal(false)} />}
        </div>
    );
};

export default InvestmentsPage;
