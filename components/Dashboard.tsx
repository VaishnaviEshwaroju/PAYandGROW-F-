import React, { useState } from 'react';
import { User, Transaction } from '../types';
import { QrCodeIcon, UserIcon, GoldBadgeIcon, SilverBadgeIcon, BronzeBadgeIcon } from './icons';
import ThemeToggle from './ThemeToggle';
import BalanceModal from './BalanceModal';
import WithdrawModal from './WithdrawModal';
import RewardsModal from './RewardsModal';
import SavingsChart from './SavingsChart';

interface DashboardProps {
    user: User;
    transactions: Transaction[];
    onOpenScanner: () => void;
    onOpenPaymentModal: () => void;
    onWithdraw: (amount: number) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, transactions, onOpenScanner, onOpenPaymentModal, onWithdraw }) => {
    const [showBalanceModal, setShowBalanceModal] = useState(false);
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showRewardsModal, setShowRewardsModal] = useState(false);

    const formatCurrency = (value: number) => {
        return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value);
    };

    const hasBadges = user.badges.bronze > 0 || user.badges.silver > 0 || user.badges.gold > 0;

    return (
        <div className="p-4 space-y-6">
            <header className="flex items-center justify-between">
                <div>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back,</p>
                    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{user.name}</h1>
                </div>
                <ThemeToggle />
            </header>

            {/* Account Balance */}
            <div className="p-5 text-white rounded-lg shadow-lg cursor-pointer bg-primary" onClick={() => setShowBalanceModal(true)}>
                <p className="text-sm opacity-80">Account Balance</p>
                <p className="mt-1 text-4xl font-bold">{formatCurrency(user.accountBalance)}</p>
            </div>
            
            {/* Savings & Actions */}
            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Savings</p>
                    <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(user.totalSaved)}</p>
                    <button 
                        onClick={() => setShowWithdrawModal(true)} 
                        className="w-full px-3 py-1 mt-2 text-xs font-semibold text-white rounded-md bg-primary-dark hover:bg-primary disabled:opacity-50"
                        disabled={user.totalSaved <= 0}
                    >
                        Withdraw
                    </button>
                </div>
                {/* Badges and Rewards Card */}
                 <div className="p-4 text-center bg-white rounded-lg shadow-sm dark:bg-gray-800">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Badges & Rewards</p>
                    <div className="flex items-center justify-center h-10 my-1 space-x-2">
                        {user.badges.gold > 0 && <div className="flex items-center"><GoldBadgeIcon /><span className="ml-1 font-bold">{user.badges.gold}</span></div>}
                        {user.badges.silver > 0 && <div className="flex items-center"><SilverBadgeIcon /><span className="ml-1 font-bold">{user.badges.silver}</span></div>}
                        {user.badges.bronze > 0 && <div className="flex items-center"><BronzeBadgeIcon /><span className="ml-1 font-bold">{user.badges.bronze}</span></div>}
                        {!hasBadges && <p className="text-xs text-gray-400">Start saving to earn!</p>}
                    </div>
                    <button 
                        onClick={() => setShowRewardsModal(true)} 
                        className="w-full px-3 py-1 mt-2 text-xs font-semibold text-white rounded-md bg-primary-dark hover:bg-primary disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
                        disabled={!hasBadges}
                    >
                        {hasBadges ? 'View Offers' : 'Save more to unlock'}
                    </button>
                </div>
            </div>

            {/* Payment Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={onOpenScanner}
                    className="flex flex-col items-center justify-center w-full py-3 font-semibold text-white transition-colors duration-200 rounded-lg shadow-lg bg-primary-dark hover:bg-primary"
                >
                    <QrCodeIcon className="w-8 h-8 mb-1" />
                    Scan & Pay
                </button>
                <button
                    onClick={onOpenPaymentModal}
                    className="flex flex-col items-center justify-center w-full py-3 font-semibold text-white transition-colors duration-200 rounded-lg shadow-lg bg-primary-dark hover:bg-primary"
                >
                    <UserIcon className="w-8 h-8 mb-1" />
                    Pay Contact
                </button>
            </div>

            {/* Savings Chart */}
            <SavingsChart transactions={transactions} />

            {/* Recent Transactions */}
            <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Recent Activity</h2>
                <div className="mt-2 space-y-2">
                    {transactions.length > 0 ? (
                        transactions.slice(0, 3).map(tx => (
                            <div key={tx.id} className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm dark:bg-gray-800">
                                <div>
                                    <p className="font-medium text-gray-900 dark:text-white">{tx.vendor}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(tx.date).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right">
                                     {tx.type === 'payment' ? (
                                        <p className="font-semibold text-red-500">-{formatCurrency(tx.amount)}</p>
                                     ) : (
                                        <p className="font-semibold text-green-500">+{formatCurrency(tx.amount)}</p>
                                     )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="mt-4 text-center text-gray-500 dark:text-gray-400">Your recent transactions will appear here.</p>
                    )}
                </div>
            </div>

            {/* Modals */}
            {showBalanceModal && <BalanceModal balance={user.accountBalance} onClose={() => setShowBalanceModal(false)} />}
            {showWithdrawModal && <WithdrawModal totalSaved={user.totalSaved} onWithdraw={(amount) => { onWithdraw(amount); setShowWithdrawModal(false); }} onClose={() => setShowWithdrawModal(false)} />}
            {showRewardsModal && <RewardsModal transactions={transactions} onClose={() => setShowRewardsModal(false)} />}
        </div>
    );
};

export default Dashboard;