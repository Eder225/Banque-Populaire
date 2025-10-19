import React, { useState, useMemo } from 'react';
import { FormData } from './AccountOpening';

interface Step1Props {
    data: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNext: () => void;
}

const Step1_PersonalInfo: React.FC<Step1Props> = ({ data, handleChange, onNext }) => {
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validate = () => {
        const newErrors: Partial<FormData> = {};
        if (!data.firstName) newErrors.firstName = "Le prénom est requis.";
        if (!data.lastName) newErrors.lastName = "Le nom est requis.";
        if (!data.birthDate) newErrors.birthDate = "La date de naissance est requise.";
        if (!data.email) newErrors.email = "L'email est requis.";
        else if (!/\S+@\S+\.\S+/.test(data.email)) newErrors.email = "L'adresse email est invalide.";
        if (!data.address) newErrors.address = "L'adresse est requise.";
        if (!data.city) newErrors.city = "La ville est requise.";
        if (!data.zipCode) newErrors.zipCode = "Le code postal est requis.";
        else if (!/^\d{5}$/.test(data.zipCode)) newErrors.zipCode = "Le code postal doit contenir 5 chiffres.";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNextClick = () => {
        if (validate()) {
            onNext();
        }
    };
    
    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <h2 className="text-2xl font-bold text-horizon-blue-primary mb-2">Commençons par faire connaissance</h2>
            <p className="text-gray-500 mb-8">Veuillez renseigner vos informations personnelles.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">Prénom</label>
                    <input type="text" name="firstName" id="firstName" value={data.firstName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                 <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Nom</label>
                    <input type="text" name="lastName" id="lastName" value={data.lastName} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                 <div>
                    <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">Date de naissance</label>
                    <input type="date" name="birthDate" id="birthDate" value={data.birthDate} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                 <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse e-mail</label>
                    <input type="email" name="email" id="email" value={data.email} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                 <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Téléphone (facultatif)</label>
                    <input type="tel" name="phone" id="phone" value={data.phone} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" />
                </div>
                 <div className="md:col-span-2">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Adresse</label>
                    <input type="text" name="address" id="address" value={data.address} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                 <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700">Code Postal</label>
                    <input type="text" name="zipCode" id="zipCode" pattern="\d{5}" maxLength={5} value={data.zipCode} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">Ville</label>
                    <input type="text" name="city" id="city" value={data.city} onChange={handleChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary" required />
                </div>
            </div>

            <div className="mt-10 flex justify-end">
                <button type="button" onClick={handleNextClick} className="bg-horizon-blue-primary text-white px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105">
                    Continuer
                </button>
            </div>
        </form>
    );
};

export default Step1_PersonalInfo;