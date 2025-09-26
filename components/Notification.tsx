import React, { useEffect } from 'react';

interface NotificationProps {
    message: string;
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div 
            className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 text-white rounded-full shadow-lg bg-primary animate-slide-up-fade-in"
            role="alert"
        >
            <p className="font-semibold">🏆 {message}</p>
            <style>{`
                @keyframes slide-up-fade-in {
                    0% {
                        transform: translate(-50%, 100%);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, 0);
                        opacity: 1;
                    }
                }
                .animate-slide-up-fade-in {
                    animation: slide-up-fade-in 0.5s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Notification;
