import React from 'react';
import { HomeIcon, TransactionsIcon, InvestmentsIcon } from './icons';

interface BottomNavProps {
    activeTab: 'dashboard' | 'transactions' | 'investments';
    setActiveTab: (tab: 'dashboard' | 'transactions' | 'investments') => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: HomeIcon },
        { id: 'transactions', label: 'History', icon: TransactionsIcon },
        { id: 'investments', label: 'Grow', icon: InvestmentsIcon },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-t dark:bg-gray-800 dark:border-gray-700">
            <div className="flex justify-around h-16">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as any)}
                        className={`flex flex-col items-center justify-center w-full text-sm font-medium transition-colors duration-200 ${
                            activeTab === item.id 
                                ? 'text-primary' 
                                : 'text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light'
                        }`}
                    >
                        <item.icon className="w-6 h-6 mb-1" />
                        <span>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default BottomNav;
