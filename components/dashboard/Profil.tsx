import React from 'react';
import { User } from '../../database';

interface ProfilProps {
    userData: User;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const InfoRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-horizon-gray">{value}</p>
    </div>
);

const Profil: React.FC<ProfilProps> = ({ userData }) => {
    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-horizon-blue-primary">Mon Profil</h1>
                <p className="text-gray-500 mt-1">Consultez les informations relatives à votre compte.</p>
            </header>

            <div className="space-y-8">
                {/* Personal Information */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-horizon-blue-primary border-b pb-3 mb-4">Informations Personnelles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoRow label="Nom Complet" value={userData.name} />
                        <InfoRow label="Identifiant Client" value={userData.id} />
                    </div>
                </div>

                {/* Account Details */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-horizon-blue-primary border-b pb-3 mb-4">Mes Comptes</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold text-lg text-horizon-gray mb-2">{userData.accounts.courant.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoRow label="IBAN" value={userData.accounts.courant.iban || 'N/A'} />
                                <InfoRow label="Solde" value={formatCurrency(userData.accounts.courant.balance)} />
                            </div>
                        </div>
                        <hr />
                        <div>
                             <h3 className="font-semibold text-lg text-horizon-gray mb-2">{userData.accounts.livretA.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InfoRow label="IBAN" value={userData.accounts.livretA.iban || 'N/A'} />
                                <InfoRow label="Solde" value={formatCurrency(userData.accounts.livretA.balance)} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Details */}
                <div className="bg-white p-8 rounded-xl shadow-md">
                    <h2 className="text-xl font-bold text-horizon-blue-primary border-b pb-3 mb-4">Mes Cartes Bancaires</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {userData.cards.map(card => (
                            <div key={card.id} className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="font-bold text-horizon-blue-primary">{card.type}</h3>
                                <InfoRow label="Numéro de carte" value={card.number} />
                                <InfoRow label="Titulaire" value={card.holderName} />
                                <InfoRow label="Date d'expiration" value={card.expiry} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profil;
