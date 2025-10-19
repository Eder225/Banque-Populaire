import React from 'react';
import { FormData } from './AccountOpening';

interface Step3Props {
    data: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBack: () => void;
    onSubmit: () => void;
}

const ReviewItem: React.FC<{label: string, value: string}> = ({ label, value }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="font-semibold text-horizon-gray">{value || 'Non renseigné'}</p>
    </div>
)

const Step3_Review: React.FC<Step3Props> = ({ data, handleChange, onBack, onSubmit }) => {
    return (
         <div>
            <h2 className="text-2xl font-bold text-horizon-blue-primary mb-2">Un dernier coup d'œil</h2>
            <p className="text-gray-500 mb-8">Veuillez vérifier que toutes vos informations sont correctes avant de finaliser votre demande.</p>
            
            <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                <div>
                    <h3 className="font-bold text-horizon-blue-primary border-b pb-2 mb-4">Vos informations</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <ReviewItem label="Prénom" value={data.firstName} />
                        <ReviewItem label="Nom" value={data.lastName} />
                        <ReviewItem label="Date de naissance" value={data.birthDate} />
                        <ReviewItem label="Email" value={data.email} />
                        <ReviewItem label="Téléphone" value={data.phone} />
                        <ReviewItem label="Adresse" value={`${data.address}, ${data.zipCode} ${data.city}`} />
                    </div>
                </div>
                 <div>
                    <h3 className="font-bold text-horizon-blue-primary border-b pb-2 mb-4">Votre offre</h3>
                    <ReviewItem label="Offre choisie" value={data.offer === 'essential' ? 'Essentiel (2€/mois)' : 'Premium (8€/mois)'} />
                </div>
            </div>

            <div className="mt-8">
                <label className="flex items-start">
                    <input 
                        type="checkbox"
                        name="agreedToTerms" 
                        checked={data.agreedToTerms}
                        onChange={handleChange}
                        className="h-5 w-5 rounded border-gray-300 text-horizon-blue-primary focus:ring-horizon-blue-primary mt-0.5" 
                    />
                    <span className="ml-3 text-sm text-gray-700">
                        Je reconnais avoir lu et accepté les <a href="#" className="font-semibold text-horizon-blue-primary hover:underline">Conditions Générales de Vente</a> et la <a href="#" className="font-semibold text-horizon-blue-primary hover:underline">Politique de Confidentialité</a>.
                    </span>
                </label>
            </div>


            <div className="mt-10 flex justify-between items-center">
                <button type="button" onClick={onBack} className="text-horizon-blue-primary font-bold hover:underline">
                    &larr; Précédent
                </button>
                <button type="button" onClick={onSubmit} disabled={!data.agreedToTerms} className="bg-horizon-accent text-horizon-blue-primary px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 disabled:text-white">
                    Soumettre ma demande
                </button>
            </div>
        </div>
    );
};

export default Step3_Review;