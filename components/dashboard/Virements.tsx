import React, { useState } from 'react';
import { PlusIcon } from '../icons/PlusIcon';
import { User, Transaction } from '../../database';
import { ArrowRightLeftIcon } from '../icons/ArrowRightLeftIcon';
import { CalendarDaysIcon } from '../icons/CalendarDaysIcon';
import { ArrowPathIcon } from '../icons/ArrowPathIcon';

interface Beneficiary {
    name: string;
    iban: string;
}

const initialBeneficiaries: Beneficiary[] = [
    { name: 'Alice Martin', iban: 'FR7630004000050000123456789' },
    { name: 'Propriétaire Logement', iban: 'FR7630003000010000987654321' },
    { name: 'Paul Durand', iban: 'FR7630002000030000543210987' }
];

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const getInitials = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
        return `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
};

type TransferType = 'ponctuel' | 'programme' | 'permanent';

interface VirementsProps {
    userData: User;
    onTransferSuccess: (updatedUser: User, newTransaction: Transaction) => void;
}

const Virements: React.FC<VirementsProps> = ({ userData, onTransferSuccess }) => {
    const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(initialBeneficiaries);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isConfirmationVisible, setIsConfirmationVisible] = useState(false);
    
    const [newBeneficiaryName, setNewBeneficiaryName] = useState('');
    const [newBeneficiaryIban, setNewBeneficiaryIban] = useState('');

    const [amount, setAmount] = useState('');
    const [selectedBeneficiary, setSelectedBeneficiary] = useState('');
    const [reason, setReason] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const [transferType, setTransferType] = useState<TransferType>('ponctuel');
    const [scheduledDate, setScheduledDate] = useState('');
    const [frequency, setFrequency] = useState('mensuel');

    const handleAddBeneficiary = (e: React.FormEvent) => {
        e.preventDefault();
        if (newBeneficiaryName.trim() && newBeneficiaryIban.trim()) {
            setBeneficiaries([...beneficiaries, { name: newBeneficiaryName, iban: newBeneficiaryIban }]);
            setNewBeneficiaryName('');
            setNewBeneficiaryIban('');
            setIsModalOpen(false);
        }
    };

    const handleInitiateTransfer = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        const transferAmount = parseFloat(amount);
        if (!selectedBeneficiary || !amount || transferAmount <= 0) {
            setError('Veuillez sélectionner un bénéficiaire et entrer un montant valide.');
            return;
        }
        if (transferAmount > userData.accounts.courant.balance) {
            setError('Solde insuffisant pour effectuer ce virement.');
            return;
        }
        if (email && !/\S+@\S+\.\S+/.test(email)) {
            setError('Veuillez entrer une adresse e-mail valide.');
            return;
        }
        setIsConfirmationVisible(true);
    };

    const handleConfirmTransfer = () => {
        if (transferType !== 'ponctuel') {
             // For demo, just show a notification for scheduled/recurring
            alert(`Votre virement ${transferType} a bien été enregistré !`);
            setIsConfirmationVisible(false);
            return;
        }

        const beneficiary = beneficiaries.find(b => b.iban === selectedBeneficiary);
        if (!beneficiary) return;

        const transferAmount = parseFloat(amount);
        const newTransactionId = `TX-${Date.now()}`;

        const newTransaction: Transaction = {
            id: newTransactionId,
            description: `Virement à ${beneficiary.name}`,
            date: new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            amount: -transferAmount,
            type: 'debit',
            details: {
                reason: reason || "Non spécifié",
                recipientName: beneficiary.name,
                recipientIban: beneficiary.iban,
                senderName: userData.name,
                senderIban: userData.accounts.courant.iban || "N/A",
                recipientEmail: email || undefined,
            }
        };

        const updatedUserData: User = {
            ...userData,
            accounts: {
                ...userData.accounts,
                courant: {
                    ...userData.accounts.courant,
                    balance: userData.accounts.courant.balance - transferAmount
                }
            },
            transactions: [newTransaction, ...userData.transactions]
        };
        
        onTransferSuccess(updatedUserData, newTransaction);
        
        setIsConfirmationVisible(false);
        setAmount('');
        setSelectedBeneficiary('');
        setReason('');
        setEmail('');
    };
    
    const transferHistory = userData.transactions.filter(tx => tx.description.toLowerCase().startsWith('virement'));

    return (
        <div className="animate-fade-in">
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
                        <h2 className="text-xl font-bold text-horizon-blue-primary mb-6">Ajouter un bénéficiaire</h2>
                        <form onSubmit={handleAddBeneficiary} className="space-y-4">
                            <div>
                                <label htmlFor="beneficiaryName" className="block text-sm font-medium text-gray-700">Nom du bénéficiaire</label>
                                <input type="text" id="beneficiaryName" value={newBeneficiaryName} onChange={(e) => setNewBeneficiaryName(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" required />
                            </div>
                             <div>
                                <label htmlFor="beneficiaryIban" className="block text-sm font-medium text-gray-700">IBAN</label>
                                <input type="text" id="beneficiaryIban" value={newBeneficiaryIban} onChange={(e) => setNewBeneficiaryIban(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" placeholder="FRXX..." required />
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Annuler</button>
                                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-horizon-blue-primary rounded-lg hover:bg-opacity-90">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {isConfirmationVisible && (
                <div className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center animate-fade-in">
                    <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md text-center">
                        <h2 className="text-xl font-bold text-horizon-blue-primary mb-4">Confirmer le virement</h2>
                        <p className="text-horizon-gray mb-2">Vous êtes sur le point de virer</p>
                        <p className="text-4xl font-bold text-horizon-blue-primary mb-4">{formatCurrency(parseFloat(amount))}</p>
                        <p className="text-horizon-gray mb-6">à <span className="font-semibold">{beneficiaries.find(b => b.iban === selectedBeneficiary)?.name}</span></p>
                        {reason && <p className="text-sm text-gray-500 mb-6">Motif : "{reason}"</p>}
                        {email && <p className="text-sm text-gray-500 mb-6">Notification envoyée à : <span className="font-semibold">{email}</span></p>}
                        {transferType === 'programme' && <p className="text-sm text-gray-500 mb-6">Exécution le : <span className="font-semibold">{scheduledDate}</span></p>}
                        {transferType === 'permanent' && <p className="text-sm text-gray-500 mb-6">Fréquence : <span className="font-semibold">{frequency}</span></p>}
                        
                        <div className="flex justify-center gap-4">
                            <button onClick={() => setIsConfirmationVisible(false)} className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Modifier</button>
                            <button onClick={handleConfirmTransfer} className="px-6 py-2 font-semibold text-white bg-horizon-blue-primary rounded-lg hover:bg-opacity-90">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-horizon-blue-primary">Virements</h1>
                <p className="text-gray-500 mt-1">Effectuez un virement ponctuel, programmé ou permanent en toute sécurité.</p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-xl shadow-md">
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex gap-6" aria-label="Tabs">
                            <button onClick={() => setTransferType('ponctuel')} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium flex items-center gap-2 ${transferType === 'ponctuel' ? 'border-horizon-accent text-horizon-accent' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                <ArrowRightLeftIcon className="w-5 h-5"/> Virement Ponctuel
                            </button>
                            <button onClick={() => setTransferType('programme')} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium flex items-center gap-2 ${transferType === 'programme' ? 'border-horizon-accent text-horizon-accent' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                <CalendarDaysIcon className="w-5 h-5"/> Virement Programmé
                            </button>
                             <button onClick={() => setTransferType('permanent')} className={`shrink-0 border-b-2 px-1 pb-4 text-sm font-medium flex items-center gap-2 ${transferType === 'permanent' ? 'border-horizon-accent text-horizon-accent' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'}`}>
                                <ArrowPathIcon className="w-5 h-5"/> Virement Permanent
                            </button>
                        </nav>
                    </div>
                    
                    <form onSubmit={handleInitiateTransfer} className="space-y-4">
                        <div>
                            <label htmlFor="fromAccount" className="block text-sm font-medium text-gray-700">Compte à débiter</label>
                            <select id="fromAccount" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm bg-gray-50 cursor-not-allowed">
                                <option>Compte Courant - SOLDE : {formatCurrency(userData.accounts.courant.balance)}</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="beneficiary" className="block text-sm font-medium text-gray-700">Bénéficiaire</label>
                            <select id="beneficiary" value={selectedBeneficiary} onChange={e => setSelectedBeneficiary(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" required>
                                <option value="" disabled>Choisir un bénéficiaire</option>
                                {beneficiaries.map(b => <option key={b.iban} value={b.iban}>{b.name} ({b.iban})</option>)}
                            </select>
                        </div>
                        <div>
                             <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Montant</label>
                            <input type="number" id="amount" placeholder="0,00" value={amount} onChange={e => setAmount(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" required />
                        </div>

                        {transferType === 'programme' && (
                            <div>
                                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700">Date d'exécution</label>
                                <input type="date" id="scheduledDate" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" required />
                            </div>
                        )}
                        {transferType === 'permanent' && (
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">Fréquence</label>
                                    <select id="frequency" value={frequency} onChange={e => setFrequency(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" required>
                                        <option value="mensuel">Mensuelle</option>
                                        <option value="trimestriel">Trimestrielle</option>
                                        <option value="annuel">Annuelle</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Date de début</label>
                                    <input type="date" id="startDate" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" required />
                                </div>
                            </div>
                        )}

                         <div>
                             <label htmlFor="reason" className="block text-sm font-medium text-gray-700">Motif (facultatif)</label>
                            <input type="text" id="reason" placeholder="Ex: Loyer, Cadeau d'anniversaire..." value={reason} onChange={e => setReason(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">E-mail du bénéficiaire (pour notification, facultatif)</label>
                            <input type="email" id="email" placeholder="exemple@domaine.com" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary sm:text-sm" />
                        </div>
                        {error && <p className="text-xs text-center text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
                        <div className="pt-4">
                            <button type="submit" className="w-full bg-horizon-blue-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed" disabled={!selectedBeneficiary || !amount || parseFloat(amount) <= 0}>
                                Valider le virement
                            </button>
                        </div>
                    </form>
                </div>
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                           <h2 className="text-lg font-bold text-horizon-blue-primary">Bénéficiaires</h2>
                           <button onClick={() => setIsModalOpen(true)} className="text-horizon-accent hover:text-horizon-blue-primary p-1 rounded-full transition-colors"><PlusIcon className="w-6 h-6" /></button>
                        </div>
                        <ul className="space-y-2 max-h-48 overflow-y-auto">
                            {beneficiaries.map(b => (
                                <li key={b.iban} onClick={() => setSelectedBeneficiary(b.iban)} className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedBeneficiary === b.iban ? 'bg-horizon-blue-secondary' : 'hover:bg-gray-50'}`}>
                                    <div className="w-8 h-8 rounded-full bg-horizon-accent text-white font-bold text-sm flex items-center justify-center flex-shrink-0">{getInitials(b.name)}</div>
                                    <div className="text-sm overflow-hidden">
                                        <p className="font-medium text-horizon-gray truncate">{b.name}</p>
                                        <p className="text-gray-400 truncate">{b.iban}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-md">
                           <h2 className="text-lg font-bold text-horizon-blue-primary mb-4">Historique des virements</h2>
                            <ul className="space-y-3">
                            {transferHistory.slice(0, 4).map((t, i) => (
                                <li key={i} className="flex justify-between items-center text-sm">
                                    <div>
                                        <p className="font-medium text-horizon-gray">{t.description}</p>
                                        <p className="text-xs text-gray-400">{t.date}</p>
                                    </div>
                                    <span className="font-semibold text-horizon-gray">{formatCurrency(t.amount)}</span>
                                </li>
                            ))}
                        </ul>
                       </div>
                </div>
            </div>
        </div>
    );
};

export default Virements;