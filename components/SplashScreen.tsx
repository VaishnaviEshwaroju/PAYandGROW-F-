import React from 'react';

const PayGrowLogo = () => (
    <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 10C27.9086 10 10 27.9086 10 50C10 72.0914 27.9086 90 50 90V10Z" fill="white" fillOpacity="0.3"/>
        <path d="M50 10C72.0914 10 90 27.9086 90 50C90 72.0914 72.0914 90 50 90V10Z" fill="white"/>
        <path d="M68 40L50 58L32 40" stroke="#059669" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M50 58V75" stroke="#059669" strokeWidth="6" strokeLinecap="round"/>
    </svg>
);


const SplashScreen: React.FC = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-primary">
            <div className="text-center animate-fade-in-scale">
                <PayGrowLogo />
                <h1 className="mt-4 text-4xl font-bold text-white">Pay&Grow</h1>
            </div>
            <style>{`
                @keyframes fade-in-scale {
                    0% {
                        opacity: 0;
                        transform: scale(0.8);
                    }
                    100% {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
                .animate-fade-in-scale {
                    animation: fade-in-scale 1s ease-in-out;
                }
            `}</style>
        </div>
    );
};

export default SplashScreen;
