import React, { useState, useEffect } from 'react';
import AuthScreen from './components/AuthScreen';
import Dashboard from './components/Dashboard';
import SplashScreen from './components/SplashScreen';
import PaymentModal from './components/PaymentModal';
import Scanner from './components/Scanner';
import Notification from './components/Notification';
import BottomNav from './components/BottomNav';
import TransactionsPage from './components/TransactionsPage';
import InvestmentsPage from './components/InvestmentsPage';
import { User, Transaction, Badges, TransactionType } from './types';
import { getSavingsInsight } from './services/ibmGraniteService';
import { type } from 'os';

const App: React.FC = () => {
    const [appState, setAppState] = useState<'loading' | 'auth' | 'main'>('loading');
    const [user, setUser] = useState<User | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showScanner, setShowScanner] = useState(false);
    const [notification, setNotification] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'investments'>('dashboard');

    useEffect(() => {
        const timer = setTimeout(() => {
            const storedUser = localStorage.getItem('payAndGrowUser');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
                const storedTransactions = localStorage.getItem(`payAndGrowTransactions_${parsedUser.phone}`);
                if (storedTransactions) {
                    setTransactions(JSON.parse(storedTransactions));
                }
                setAppState('main');
            } else {
                setAppState('auth');
            }
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleLogin = (phone: string) => {
        const newUser: User = {
            name: "Alex Doe", // In a real app, this would come from a profile setup
            accountBalance: 15450.75,
            totalSaved: 0,
            badges: { bronze: 0, silver: 0, gold: 0 },
            phone: phone,
            bankAccount: 'XXXX-XXXX-1234'
        };
        setUser(newUser);
        setTransactions([]);
        localStorage.setItem('payAndGrowUser', JSON.stringify(newUser));
        localStorage.setItem(`payAndGrowTransactions_${phone}`, JSON.stringify([]));
        setAppState('main');
    };

    const handlePayment = async (amount: number, vendor: string, multiplier: number) => {
        if (!user) return;

        const baseSavings = (Math.ceil(amount / 10) * 10) - amount;
        const savingsAmount = (baseSavings > 0 ? baseSavings : 0) * multiplier;
        const totalDeduction = amount + savingsAmount;

        if (user.accountBalance < totalDeduction) {
            setNotification("Insufficient funds for this transaction and boosted saving.");
            return;
        }

        const newTransaction: Transaction = {
            id: String(Date.now()),
            vendor,
            amount,
            date: new Date().toISOString(),
            type: 'payment',
            roundedAmount: savingsAmount,
            multiplier: multiplier,
        };

        const oldTotalSaved = user.totalSaved;
        const newTotalSaved = user.totalSaved + savingsAmount;

        const updatedUser = {
            ...user,
            accountBalance: user.accountBalance - totalDeduction,
            totalSaved: newTotalSaved,
        };

        // Badge logic
        const oldBronzeMilestones = Math.floor(oldTotalSaved / 100);
        const newBronzeMilestones = Math.floor(newTotalSaved / 100);
        let newBadgeEarned: string | null = null;
        let badges = { ...user.badges };

        if (newBronzeMilestones > oldBronzeMilestones) {
            let bronze = badges.bronze + (newBronzeMilestones - oldBronzeMilestones);
            let silver = badges.silver;
            let gold = badges.gold;
            newBadgeEarned = 'Bronze Badge Earned!';

            if (bronze >= 3) {
                const newSilver = Math.floor(bronze / 3);
                silver += newSilver;
                bronze %= 3;
                newBadgeEarned = 'Silver Badge Earned!';
            }
            if (silver >= 3) {
                const newGold = Math.floor(silver / 3);
                gold += newGold;
                silver %= 3;
                newBadgeEarned = 'Gold Badge Earned!';
            }
            badges = { bronze, silver, gold };
        }
        
        updatedUser.badges = badges;
        
        const newTransactions = [newTransaction, ...transactions];
        setUser(updatedUser);
        setTransactions(newTransactions);
        localStorage.setItem('payAndGrowUser', JSON.stringify(updatedUser));
        localStorage.setItem(`payAndGrowTransactions_${user.phone}`, JSON.stringify(newTransactions));
        setShowPaymentModal(false);

        if (newBadgeEarned) {
            setNotification(newBadgeEarned);
        } else if (savingsAmount > 0) {
            const insight = await getSavingsInsight(savingsAmount);
            setNotification(insight);
        }
    };

    const handleWithdraw = (amount: number) => {
        if (!user) return;
        if (amount > user.totalSaved) {
            setNotification("Insufficient saved funds to withdraw.");
            return;
        }
        const newTransaction: Transaction = {
            id: String(Date.now()),
            vendor: 'Savings Withdrawal',
            amount,
            date: new Date().toISOString(),
            type: 'withdrawal', // Use 'withdrawal' for clarity
            roundedAmount: 0,
            multiplier: 0,
        };
        const updatedUser = {
            ...user,
            accountBalance: user.accountBalance + amount,
            totalSaved: Math.max(user.totalSaved - amount, 0), // Prevent negative savings
        };
        const newTransactions = [newTransaction, ...transactions];
        setUser(updatedUser);
        setTransactions(newTransactions);
        localStorage.setItem('payAndGrowUser', JSON.stringify(updatedUser));
        localStorage.setItem(`payAndGrowTransactions_${user.phone}`, JSON.stringify(newTransactions));
        setNotification(`₹${amount.toFixed(2)} withdrawn.`);
    };

    const handleScanSuccess = (data: string) => {
        setShowScanner(false);
        setShowPaymentModal(true);
        console.log("Scanned data:", data);
    };

    const renderContent = () => {
        if (!user) return null;
        switch (activeTab) {
            case 'dashboard':
                return <Dashboard user={user} transactions={transactions} onOpenScanner={() => setShowScanner(true)} onOpenPaymentModal={() => setShowPaymentModal(true)} onWithdraw={handleWithdraw}/>;
            case 'transactions':
                return <TransactionsPage transactions={transactions} />;
            case 'investments':
                return <InvestmentsPage user={user} />;
            default:
                return <Dashboard user={user} transactions={transactions} onOpenScanner={() => setShowScanner(true)} onOpenPaymentModal={() => setShowPaymentModal(true)} onWithdraw={handleWithdraw}/>;
        }
    };

    if (appState === 'loading') {
        return <SplashScreen />;
    }

    if (appState === 'auth' || !user) {
        return <AuthScreen onLogin={handleLogin} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900">
             <div className="max-w-md mx-auto pb-20">
                <main>
                    {renderContent()}
                </main>
            </div>

            {showPaymentModal && <PaymentModal accountBalance={user.accountBalance} onClose={() => setShowPaymentModal(false)} onPayment={handlePayment} />}
            {showScanner && <Scanner onClose={() => setShowScanner(false)} onScanSuccess={handleScanSuccess} />}
            {notification && <Notification message={notification} onClose={() => setNotification(null)} />}
            
            <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>
    );
}

export default App;