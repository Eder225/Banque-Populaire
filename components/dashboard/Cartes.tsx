import React, { useState } from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { LockClosedIcon } from '../icons/LockIcon';
import { AdjustmentsHorizontalIcon } from '../icons/AdjustmentsHorizontalIcon';
import { User, Card } from '../../database';
import { ChevronLeftIcon } from '../icons/ChevronLeftIcon';
import { ChevronRightIcon } from '../icons/ChevronRightIcon';
import { ExclamationTriangleIcon } from '../icons/ExclamationTriangleIcon';

const CardActionButton: React.FC<{icon: React.ReactNode, label: string, onClick?: () => void}> = ({icon, label, onClick}) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 text-horizon-blue-primary hover:text-horizon-accent transition-colors w-24">
        <div className="bg-horizon-blue-secondary p-4 rounded-full">
            {icon}
        </div>
        <span className="text-xs font-semibold text-center">{label}</span>
    </button>
)

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
};

// Modals
const LimitsModal: React.FC<{card: Card, onClose: () => void, onSave: (newLimits: Card['limits']) => void}> = ({ card, onClose, onSave }) => {
    const [paymentLimit, setPaymentLimit] = useState(card.limits.payment.current);
    const [withdrawalLimit, setWithdrawalLimit] = useState(card.limits.withdrawal.current);

    const handleSave = () => {
        onSave({
            payment: { ...card.limits.payment, current: paymentLimit },
            withdrawal: { ...card.limits.withdrawal, current: withdrawalLimit }
        });
        onClose();
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
            <h2 className="text-xl font-bold text-horizon-blue-primary mb-6">Modifier les plafonds</h2>
            <div className="space-y-6">
                <div>
                    <label className="block font-semibold mb-2">Plafond de paiement (sur 30 jours)</label>
                    <input type="range" min="0" max={card.limits.payment.max} step="100" value={paymentLimit} onChange={e => setPaymentLimit(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-horizon-accent"/>
                    <div className="text-center font-bold text-lg text-horizon-blue-primary mt-2">{formatCurrency(paymentLimit)} / {formatCurrency(card.limits.payment.max)}</div>
                </div>
                 <div>
                    <label className="block font-semibold mb-2">Plafond de retrait (sur 7 jours)</label>
                    <input type="range" min="0" max={card.limits.withdrawal.max} step="50" value={withdrawalLimit} onChange={e => setWithdrawalLimit(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-horizon-accent"/>
                    <div className="text-center font-bold text-lg text-horizon-blue-primary mt-2">{formatCurrency(withdrawalLimit)} / {formatCurrency(card.limits.withdrawal.max)}</div>
                </div>
            </div>
            <div className="flex justify-end gap-4 pt-8">
                <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-horizon-blue-primary rounded-lg hover:bg-opacity-90">Enregistrer</button>
            </div>
        </div>
    )
}

const PinModal: React.FC<{card: Card, onClose: () => void}> = ({ card, onClose }) => {
    const [isRevealed, setIsRevealed] = useState(false);
    return (
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
            <h2 className="text-xl font-bold text-horizon-blue-primary mb-4">Code Confidentiel</h2>
            {isRevealed ? (
                <>
                    <p className="text-gray-500 mb-4">Votre code PIN pour la carte se terminant par {card.number.slice(-4)} est :</p>
                    <div className="bg-gray-100 p-4 rounded-lg my-4">
                        <p className="text-4xl font-bold tracking-widest text-horizon-blue-primary">{card.pin}</p>
                    </div>
                    <button onClick={onClose} className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-horizon-blue-primary rounded-lg hover:bg-opacity-90">Fermer</button>
                </>
            ) : (
                <>
                    <p className="text-gray-500 mb-6">Pour des raisons de sécurité, veuillez confirmer votre identité pour afficher votre code PIN.</p>
                     <button onClick={() => setIsRevealed(true)} className="w-full px-4 py-2 text-sm font-medium text-white bg-horizon-accent rounded-lg hover:bg-opacity-90">Révéler le code</button>
                    <button onClick={onClose} className="mt-2 w-full px-4 py-2 text-sm font-medium text-gray-700">Annuler</button>
                </>
            )}
        </div>
    );
};

const BlockModal: React.FC<{card: Card, onClose: () => void}> = ({ card, onClose }) => {
    return (
         <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-500 mx-auto mb-4"/>
            <h2 className="text-xl font-bold text-horizon-blue-primary mb-4">Faire opposition</h2>
            <p className="text-gray-500 mb-6">
                Vous êtes sur le point de bloquer définitivement votre carte {card.type} se terminant par {card.number.slice(-4)}. Cette action est irréversible.
            </p>
             <div className="flex justify-center gap-4">
                <button onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                <button onClick={() => { alert('Carte bloquée !'); onClose(); }} className="px-6 py-2 font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700">Confirmer l'opposition</button>
            </div>
        </div>
    )
};


interface CartesProps {
    userData: User;
    onUserDataUpdate: (updatedUser: User) => void;
    addNotification: (message: string, type?: 'success' | 'error') => void;
}

const Cartes: React.FC<CartesProps> = ({ userData, onUserDataUpdate, addNotification }) => {
    const [activeCardIndex, setActiveCardIndex] = useState(0);
    const [activeModal, setActiveModal] = useState<'limits' | 'pin' | 'block' | null>(null);

    const activeCard = userData.cards[activeCardIndex];
    
    const handleNextCard = () => setActiveCardIndex((prev) => (prev + 1) % userData.cards.length);
    const handlePrevCard = () => setActiveCardIndex((prev) => (prev - 1 + userData.cards.length) % userData.cards.length);

    const handleLimitsSave = (newLimits: Card['limits']) => {
        const updatedCards = [...userData.cards];
        updatedCards[activeCardIndex] = { ...activeCard, limits: newLimits };
        onUserDataUpdate({ ...userData, cards: updatedCards });
        addNotification('Plafonds de la carte mis à jour.');
    }

    const cardBgClasses = {
        'Visa Premier': 'from-[#013a63] to-[#012a4a]',
        'Mastercard Gold': 'from-[#c2933d] to-[#a4792a]'
    }

    return (
        <div className="animate-fade-in">
            {activeModal && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in" onClick={() => setActiveModal(null)}>
                    <div onClick={e => e.stopPropagation()}>
                        {activeModal === 'limits' && <LimitsModal card={activeCard} onClose={() => setActiveModal(null)} onSave={handleLimitsSave} />}
                        {activeModal === 'pin' && <PinModal card={activeCard} onClose={() => setActiveModal(null)} />}
                        {activeModal === 'block' && <BlockModal card={activeCard} onClose={() => setActiveModal(null)} />}
                    </div>
                </div>
            )}
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-horizon-blue-primary">Mes cartes bancaires</h1>
                <p className="text-gray-500 mt-1">Gérez vos cartes et options en toute autonomie.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-2">
                     <div className="relative">
                        <div className={`bg-gradient-to-br ${cardBgClasses[activeCard.type]} text-white p-8 rounded-2xl shadow-2xl h-64 flex flex-col justify-between transition-all duration-300`}>
                            <div>
                                <span className="font-semibold text-lg">{activeCard.type}</span>
                                <span className="float-right font-mono text-xl">{activeCard.type.includes('Visa') ? 'VISA' : 'Mastercard'}</span>
                            </div>
                            <div className="font-mono text-2xl tracking-widest text-center">
                               {activeCard.number}
                            </div>
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-xs opacity-70">Titulaire</p>
                                    <p className="font-semibold">{activeCard.holderName.toUpperCase()}</p>
                                </div>
                                <div>
                                    <p className="text-xs opacity-70">Expire fin</p>
                                    <p className="font-semibold">{activeCard.expiry}</p>
                                </div>
                            </div>
                        </div>
                        {userData.cards.length > 1 && (
                            <>
                                <button onClick={handlePrevCard} className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all"><ChevronLeftIcon className="w-6 h-6"/></button>
                                <button onClick={handleNextCard} className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md backdrop-blur-sm transition-all"><ChevronRightIcon className="w-6 h-6"/></button>
                            </>
                        )}
                    </div>
                     <div className="flex justify-center mt-4 space-x-2">
                        {userData.cards.map((_, index) => (
                            <button key={index} onClick={() => setActiveCardIndex(index)} className={`h-2 rounded-full transition-all ${index === activeCardIndex ? 'w-6 bg-horizon-blue-primary' : 'w-2 bg-gray-300'}`}></button>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-horizon-blue-primary mb-6 text-center">Actions rapides</h2>
                    <div className="flex justify-around items-start">
                        <CardActionButton icon={<EyeIcon className="w-7 h-7"/>} label="Code PIN" onClick={() => setActiveModal('pin')}/>
                        <CardActionButton icon={<LockClosedIcon className="w-7 h-7"/>} label="Faire opposition" onClick={() => setActiveModal('block')}/>
                        <CardActionButton icon={<AdjustmentsHorizontalIcon className="w-7 h-7"/>} label="Gérer plafonds" onClick={() => setActiveModal('limits')}/>
                    </div>
                </div>
            </div>

             <div className="mt-8 bg-white p-8 rounded-xl shadow-md">
                <h2 className="text-xl font-bold text-horizon-blue-primary mb-6">Options de la carte</h2>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold text-horizon-gray">Paiement sans contact</h3>
                            <p className="text-sm text-gray-500">Activé jusqu'à 50 €</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={activeCard.contactless} readOnly/>
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-horizon-blue-primary"></div>
                        </label>
                    </div>
                    <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold text-horizon-gray">Paiements en ligne</h3>
                            <p className="text-sm text-gray-500">Autorisés sur les sites sécurisés</p>
                        </div>
                         <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={activeCard.onlinePayment} readOnly/>
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-horizon-blue-primary"></div>
                        </label>
                    </div>
                     <div className="flex justify-between items-center p-4 border rounded-lg">
                        <div>
                            <h3 className="font-semibold text-horizon-gray">Paiements à l'étranger</h3>
                             <p className="text-sm text-gray-500">{activeCard.foreignPayment ? 'Activés' : 'Désactivés hors zone Euro'}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" className="sr-only peer" checked={activeCard.foreignPayment} readOnly/>
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-horizon-blue-primary"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cartes;