import React from 'react';
import { CheckIcon } from '../icons/CheckIcon';

interface StepperProps {
    currentStep: number;
    totalSteps: number;
    titles: string[];
}

const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps, titles }) => {
    return (
        <div className="w-full px-4 sm:px-8">
            <div className="flex items-center">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                    <React.Fragment key={step}>
                        <div className="flex flex-col items-center">
                           <div className={`flex items-center justify-center w-10 h-10 rounded-full text-lg font-bold transition-all duration-300 ${
                                currentStep > step ? 'bg-green-500 text-white' : 
                                currentStep === step ? 'bg-horizon-blue-primary text-white scale-110' : 
                                'bg-gray-200 text-gray-500'
                            }`}>
                                {currentStep > step ? <CheckIcon className="w-6 h-6" /> : step}
                            </div>
                            <p className={`mt-2 text-xs text-center font-semibold transition-all duration-300 ${
                                currentStep >= step ? 'text-horizon-blue-primary' : 'text-gray-400'
                            }`}>{titles[step - 1]}</p>
                        </div>
                        
                        {step < totalSteps && (
                            <div className={`flex-auto border-t-2 transition-all duration-300 mx-4 ${
                                currentStep > step ? 'border-green-500' : 'border-gray-200'
                            }`}></div>
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
};

export default Stepper;