import React, { useState, useEffect } from 'react';
import { CheckCircleIcon } from './icons/CheckIcon';
import { XCircleIcon } from './icons/XCircleIcon';
import { XMarkIcon } from './icons/XMarkIcon';

export interface NotificationData {
    id: number;
    message: string;
    type: 'success' | 'error';
}

interface NotificationProps extends NotificationData {
    onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);

    const handleClose = () => {
        setIsExiting(true);
    };

    useEffect(() => {
        if (isExiting) {
            const timer = setTimeout(() => {
                onClose();
            }, 300); // Match animation duration
            return () => clearTimeout(timer);
        }
    }, [isExiting, onClose]);

    const Icon = type === 'success' ? CheckCircleIcon : XCircleIcon;
    const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

    return (
        <div 
            className={`relative flex items-center gap-4 text-white px-6 py-4 rounded-lg shadow-2xl w-full max-w-sm ${bgColor} ${isExiting ? 'animate-slide-out-up' : 'animate-slide-in-down'}`}
            role="alert"
        >
            <Icon className="w-7 h-7 flex-shrink-0" />
            <p className="text-sm font-semibold flex-grow">{message}</p>
            <button 
                onClick={handleClose}
                className="p-1 rounded-full hover:bg-white/20 transition-colors absolute top-2 right-2"
                aria-label="Fermer la notification"
            >
                <XMarkIcon className="w-4 h-4" />
            </button>
        </div>
    );
};

export default Notification;
