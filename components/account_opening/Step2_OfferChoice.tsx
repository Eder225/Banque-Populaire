import React from 'react';
import { FormData } from './AccountOpening';
import { BanknotesIcon } from '../icons/AccountIcon';
import { CreditCardIcon } from '../icons/CreditCardIcon';
import { StarIcon } from '../icons/StarIcon';
import { ShieldCheckIcon } from '../icons/SecurityIcon';

interface Step2Props {
    data: FormData;
    handleOfferSelect: (offer: 'essential' | 'premium') => void;
    onNext: () => void;
    onBack: () => void;
}

const OfferCard: React.FC<{
    title: string;
    price: string;
    features: { icon: React.ReactNode; text: string }[];
    isSelected: boolean;
    onSelect: () => void;
}> = ({ title, price, features, isSelected, onSelect }) => (
    <div onClick={onSelect} className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'border-horizon-accent shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}>
        <h3 className="text-xl font-bold text-horizon-blue-primary">{title}</h3>
        <p className="text-3xl font-extrabold text-horizon-blue-primary my-4">{price}<span className="text-base font-medium text-gray-500">/mois</span></p>
        <ul className="space-y-3">
            {features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3 text-sm">
                    <span className="text-green-500">{feature.icon}</span>
                    <span className="text-horizon-gray">{feature.text}</span>
                </li>
            ))}
        </ul>
    </div>
);


const Step2_OfferChoice: React.FC<Step2Props> = ({ data, handleOfferSelect, onNext, onBack }) => {
    
    const essentialFeatures = [
        { icon: <BanknotesIcon className="w-5 h-5"/>, text: "Compte courant sans frais de tenue" },
        { icon: <CreditCardIcon className="w-5 h-5"/>, text: "Carte Visa Classic incluse" },
    ];
    
    const premiumFeatures = [
        ...essentialFeatures,
        { icon: <StarIcon className="w-5 h-5"/>, text: "Carte Visa Premier & retraits gratuits" },
        { icon: <ShieldCheckIcon className="w-5 h-5"/>, text: "Assurances voyage & garanties étendues" },
    ];
    
    return (
        <div>
            <h2 className="text-2xl font-bold text-horizon-blue-primary mb-2">Choisissez l'offre qui vous convient</h2>
            <p className="text-gray-500 mb-8">Comparez nos deux offres phares et sélectionnez la vôtre.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <OfferCard 
                    title="Offre Essentiel"
                    price="2€"
                    features={essentialFeatures}
                    isSelected={data.offer === 'essential'}
                    onSelect={() => handleOfferSelect('essential')}
                />
                 <OfferCard 
                    title="Offre Premium"
                    price="8€"
                    features={premiumFeatures}
                    isSelected={data.offer === 'premium'}
                    onSelect={() => handleOfferSelect('premium')}
                />
            </div>

            <div className="mt-10 flex justify-between items-center">
                <button type="button" onClick={onBack} className="text-horizon-blue-primary font-bold hover:underline">
                    &larr; Précédent
                </button>
                <button type="button" onClick={onNext} disabled={!data.offer} className="bg-horizon-blue-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100">
                    Continuer
                </button>
            </div>
        </div>
    );
};

export default Step2_OfferChoice;