import React, { useState } from 'react';
import { LogoIcon } from '../icons/LogoIcon';
import Stepper from './Stepper';
import Step1_PersonalInfo from './Step1_PersonalInfo';
import Step2_OfferChoice from './Step2_OfferChoice';
import Step3_Review from './Step3_Review';
import Step4_Success from './Step4_Success';

export interface FormData {
    firstName: string;
    lastName: string;
    birthDate: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zipCode: string;
    offer: 'essential' | 'premium' | '';
    agreedToTerms: boolean;
}

const initialFormData: FormData = {
    firstName: '',
    lastName: '',
    birthDate: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    offer: '',
    agreedToTerms: false,
};

interface AccountOpeningProps {
    onGoHome: () => void;
    onAccountOpened: () => void;
}

const AccountOpening: React.FC<AccountOpeningProps> = ({ onGoHome, onAccountOpened }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState<FormData>(initialFormData);

    const handleNext = () => setStep(prev => prev + 1);
    const handleBack = () => setStep(prev => prev - 1);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleOfferSelect = (offer: 'essential' | 'premium') => {
        setFormData(prev => ({...prev, offer}));
    };

    const handleSubmit = () => {
        console.log("Final form data submitted:", formData);
        // Here you would typically send the data to a server
        handleNext(); // Move to success step
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <Step1_PersonalInfo data={formData} handleChange={handleChange} onNext={handleNext} />;
            case 2:
                return <Step2_OfferChoice data={formData} handleOfferSelect={handleOfferSelect} onNext={handleNext} onBack={handleBack} />;
            case 3:
                return <Step3_Review data={formData} handleChange={handleChange} onBack={handleBack} onSubmit={handleSubmit} />;
            case 4:
                return <Step4_Success onFinish={onAccountOpened} />;
            default:
                return <div>Étape inconnue</div>;
        }
    };
    
    const stepTitles = ["Informations", "Offre", "Vérification"];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 lg:p-8 animate-fade-in">
             <div className="w-full max-w-4xl">
                 <div className="flex justify-between items-center mb-8">
                     <div className="flex items-center gap-3 text-2xl font-bold text-horizon-blue-primary">
                      <LogoIcon className="w-9 h-9" />
                      <span>Ouverture de compte</span>
                    </div>
                    <button onClick={onGoHome} className="text-sm text-horizon-blue-primary font-semibold hover:underline">
                      Quitter
                    </button>
                 </div>

                {step < 4 && <Stepper currentStep={step} totalSteps={3} titles={stepTitles} />}
                
                <div className="mt-8 bg-white p-6 sm:p-8 lg:p-10 rounded-xl shadow-lg">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

export default AccountOpening;