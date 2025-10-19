import React, { useState } from 'react';
import { ArrowRightLeftIcon } from './icons/ArrowRightLeftIcon';
import { CreditCardIcon } from './icons/CreditCardIcon';
import { ChatBubbleLeftRightIcon } from './icons/ChatBubbleLeftRightIcon';
import { HomeIcon } from './icons/HomeIcon';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ArrowLeftOnRectangleIcon } from './icons/ArrowLeftOnRectangleIcon';
import Synthese from './dashboard/Synthese';
import Virements from './dashboard/Virements';
import Cartes from './dashboard/Cartes';
import Messagerie from './dashboard/Messagerie';
import Profil from './dashboard/Profil';
import { LogoIcon } from './icons/LogoIcon';
import { getUserData, updateUserData, User, Transaction } from '../database';
import Notification, { NotificationData } from './Notification';
import { BellIcon } from './icons/BellIcon';
import TransactionReceipt from './dashboard/TransactionReceipt';


type DashboardTab = 'synthese' | 'virements' | 'cartes' | 'messagerie' | 'profil';

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 text-left ${active ? 'bg-white/15 text-white shadow-md' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}>
        {icon}
        <span className="font-semibold">{label}</span>
    </button>
);

const Sidebar: React.FC<{ activeTab: DashboardTab, setActiveTab: (tab: DashboardTab) => void, onLogout: () => void }> = ({ activeTab, setActiveTab, onLogout }) => (
    <div className="bg-gradient-to-b from-bp-blue-start to-bp-blue-end text-white w-64 p-4 flex flex-col min-h-screen shadow-2xl">
        <div className="flex flex-col items-center py-6 text-center">
            <LogoIcon className="w-12 h-12" />
            <span className="mt-3 text-lg font-semibold text-white/90">Banque Populaire</span>
        </div>
        <nav className="flex-grow space-y-2 mt-8">
            <NavItem icon={<HomeIcon className="w-6 h-6" />} label="Synthèse" active={activeTab === 'synthese'} onClick={() => setActiveTab('synthese')} />
            <NavItem icon={<ArrowRightLeftIcon className="w-6 h-6" />} label="Virements" active={activeTab === 'virements'} onClick={() => setActiveTab('virements')} />
            <NavItem icon={<CreditCardIcon className="w-6 h-6" />} label="Cartes" active={activeTab === 'cartes'} onClick={() => setActiveTab('cartes')}/>
            <NavItem icon={<ChatBubbleLeftRightIcon className="w-6 h-6" />} label="Messagerie" active={activeTab === 'messagerie'} onClick={() => setActiveTab('messagerie')}/>
        </nav>
        <div className="space-y-2">
            <NavItem icon={<UserCircleIcon className="w-6 h-6" />} label="Profil" active={activeTab === 'profil'} onClick={() => setActiveTab('profil')} />
             <button onClick={onLogout} className="w-full flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white/70 hover:bg-white/10 hover:text-white">
                <ArrowLeftOnRectangleIcon className="w-6 h-6" />
                <span className="font-semibold">Déconnexion</span>
            </button>
        </div>
    </div>
);

const DashboardHeader: React.FC<{ userName: string, notificationCount: number }> = ({ userName, notificationCount }) => (
    <div className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
        <div>
            <h1 className="text-3xl font-bold text-horizon-blue-primary">Bonjour, {userName.split(' ')[0]}</h1>
            <p className="text-gray-500 mt-1">Heureux de vous revoir !</p>
        </div>
        <div className="relative">
            <button className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 transition-colors">
                <BellIcon className="w-6 h-6 text-horizon-gray" />
            </button>
            {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {notificationCount}
                </span>
            )}
        </div>
    </div>
);


interface DashboardProps {
    onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('synthese');
    const [userData, setUserData] = useState<User>(getUserData());
    const [lastTransactionId, setLastTransactionId] = useState<string | null>(null);
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const [receiptData, setReceiptData] = useState<{ transaction: Transaction; user: User } | null>(null);

    const addNotification = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }, 5000);
    };

    const handleUserDataUpdate = (newUserData: User) => {
        updateUserData(newUserData);
        setUserData(newUserData);
    };

    const handleTransferSuccess = (newUserData: User, newTransaction: Transaction) => {
        handleUserDataUpdate(newUserData);
        const message = newTransaction.details?.recipientEmail 
            ? "Virement réussi et e-mail de confirmation envoyé !"
            : "Votre virement a été effectué avec succès !";
        addNotification(message);
        setReceiptData({ transaction: newTransaction, user: newUserData });
    };

    const handleCloseReceipt = () => {
        setLastTransactionId(receiptData?.transaction.id || null);
        setReceiptData(null);
        setActiveTab('synthese');
    };
    
    const renderContent = () => {
        if (receiptData) {
            return <TransactionReceipt transaction={receiptData.transaction} user={receiptData.user} onClose={handleCloseReceipt} />;
        }
        switch (activeTab) {
            case 'synthese':
                return <Synthese userData={userData} highlightedTxId={lastTransactionId} onHighlightComplete={() => setLastTransactionId(null)} />;
            case 'virements':
                return <Virements userData={userData} onTransferSuccess={handleTransferSuccess} />;
            case 'cartes':
                return <Cartes userData={userData} onUserDataUpdate={handleUserDataUpdate} addNotification={addNotification} />;
             case 'messagerie':
                return <Messagerie />;
            case 'profil':
                return <Profil userData={userData} />;
            default:
                return <Synthese userData={userData} highlightedTxId={lastTransactionId} onHighlightComplete={() => setLastTransactionId(null)} />;
        }
    }

    return (
        <div className="flex bg-gray-50 font-sans min-h-screen">
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {notifications.map(notification => (
                    <Notification 
                        key={notification.id} 
                        id={notification.id}
                        message={notification.message}
                        type={notification.type}
                        onClose={() => setNotifications(prev => prev.filter(n => n.id !== notification.id))}
                    />
                ))}
            </div>
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={onLogout} />
            <main className="flex-1 p-8 overflow-y-auto">
                {!receiptData && activeTab === 'synthese' ? (
                     <DashboardHeader userName={userData.name} notificationCount={0} />
                ) : !receiptData ? (
                    <div className="mb-8">
                       {/* Placeholder for other headers or can be removed */}
                    </div>
                ) : null}
               {renderContent()}
            </main>
        </div>
    );
};

export default Dashboard;