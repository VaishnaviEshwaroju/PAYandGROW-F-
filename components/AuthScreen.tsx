import React, { useState } from 'react';

interface AuthScreenProps {
    onLogin: (phone: string) => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin }) => {
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState<'phone' | 'otp' | 'details'>('phone');
    const [loading, setLoading] = useState(false);
    const [bankAccount, setBankAccount] = useState('');

    const handleSendOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (phone.length !== 10) {
            alert('Please enter a valid 10-digit phone number.');
            return;
        }
        setLoading(true);
        setTimeout(() => { // Simulate API call
            setStep('otp');
            setLoading(false);
        }, 1000);
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP.');
            return;
        }
        setLoading(true);
        setTimeout(() => { // Simulate API call
            setStep('details');
            setLoading(false);
        }, 1000);
    };

    const handleFinishSetup = (e: React.FormEvent) => {
        e.preventDefault();
        if (bankAccount.length < 4) { // Simple validation
             alert('Please enter valid bank details.');
             return;
        }
        setLoading(true);
        setTimeout(() => {
            onLogin(phone);
            setLoading(false);
        }, 500);
    }
    
    const renderStep = () => {
        switch(step) {
            case 'otp':
                 return (
                    <form className="space-y-6" onSubmit={handleVerifyOtp}>
                        <div>
                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Enter OTP</label>
                            <input id="otp" name="otp" type="text" required value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                className="w-full px-3 py-2 mt-1 text-center text-lg tracking-[0.5em] text-gray-900 bg-gray-100 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                                placeholder="_ _ _ _ _ _" />
                            <p className="mt-2 text-sm text-center text-gray-500">OTP sent to +91 {phone}.{' '}
                                <button type="button" onClick={() => setStep('phone')} className="font-medium text-primary hover:underline">Change</button>
                            </p>
                        </div>
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark disabled:opacity-50">
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </form>
                );
            case 'details':
                return (
                    <form className="space-y-6" onSubmit={handleFinishSetup}>
                        <div>
                            <label htmlFor="bank" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Link Bank Account</label>
                            <input id="bank" name="bank" type="text" required value={bankAccount} onChange={(e) => setBankAccount(e.target.value)}
                                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                                placeholder="e.g. XXXX-XXXX-1234" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark disabled:opacity-50">
                            {loading ? 'Setting up...' : 'Finish Setup'}
                        </button>
                    </form>
                );
            case 'phone':
            default:
                return (
                    <form className="space-y-6" onSubmit={handleSendOtp}>
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
                            <input id="phone" name="phone" type="tel" autoComplete="tel" required value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-100 border-gray-300 rounded-md shadow-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-primary focus:border-primary"
                                placeholder="9876543210" />
                        </div>
                        <button type="submit" disabled={loading} className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md bg-primary hover:bg-primary-dark disabled:opacity-50">
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </button>
                    </form>
                );
        }
    }


    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 dark:bg-gray-900">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to Pay&Grow</h1>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                      {step === 'phone' && 'Enter your phone number to begin.'}
                      {step === 'otp' && 'Verify your identity.'}
                      {step === 'details' && 'Complete your account setup.'}
                    </p>
                </div>
                {renderStep()}
            </div>
        </div>
    );
};

export default AuthScreen;
