import React from 'react';
import { CheckCircleIcon } from '../icons/CheckIcon';

interface Step4Props {
    onFinish: () => void;
}

const Step4_Success: React.FC<Step4Props> = ({ onFinish }) => {
    return (
        <div className="text-center py-12 animate-fade-in-up">
            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-horizon-blue-primary">Félicitations et bienvenue !</h1>
            <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
                Votre demande d'ouverture de compte a bien été enregistrée. Vous allez recevoir un e-mail de confirmation avec votre identifiant client.
            </p>
            <p className="text-sm text-gray-500 mt-2">Votre carte bancaire et votre code secret vous seront envoyés par courriers séparés sous 5 à 7 jours ouvrés.</p>
            <div className="mt-10">
                <button 
                    onClick={onFinish}
                    className="bg-horizon-blue-primary text-white px-8 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105"
                >
                    Accéder à mon Espace Client
                </button>
            </div>
        </div>
    );
};

export default Step4_Success;