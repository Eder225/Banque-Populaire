

import React, { useState, useMemo } from 'react';
import { HomeModernIcon } from '../icons/MortgageIcon';
import { CarIcon } from '../icons/CarIcon';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import DonutChart from './DonutChart';

interface CreditSimulatorPageProps {
    onGoHome: () => void;
    onApplyForLoanClick: () => void;
}

type ProjectType = 'immobilier' | 'consommation' | 'auto';

const projectConfig = {
    immobilier: { icon: <HomeModernIcon className="w-6 h-6"/>, label: "Immobilier", rate: 3.5, minAmount: 20000, maxAmount: 500000, defaultAmount: 150000, minDuration: 5, maxDuration: 25, defaultDuration: 20, stepAmount: 1000, stepDuration: 1 },
    consommation: { icon: <ShoppingCartIcon className="w-6 h-6"/>, label: "Consommation", rate: 5.0, minAmount: 1000, maxAmount: 75000, defaultAmount: 10000, minDuration: 1, maxDuration: 10, defaultDuration: 5, stepAmount: 500, stepDuration: 1 },
    auto: { icon: <CarIcon className="w-6 h-6"/>, label: "Auto", rate: 4.5, minAmount: 1000, maxAmount: 50000, defaultAmount: 15000, minDuration: 1, maxDuration: 7, defaultDuration: 4, stepAmount: 500, stepDuration: 1 },
};

const formatCurrency = (value: number) => new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: 0 }).format(value);
const formatYears = (value: number) => `${value} an${value > 1 ? 's' : ''}`;

const CreditSimulatorPage: React.FC<CreditSimulatorPageProps> = ({ onGoHome, onApplyForLoanClick }) => {
    const [projectType, setProjectType] = useState<ProjectType>('immobilier');
    const [amount, setAmount] = useState<number>(projectConfig.immobilier.defaultAmount);
    const [duration, setDuration] = useState<number>(projectConfig.immobilier.defaultDuration);

    const config = projectConfig[projectType];

    const handleProjectTypeChange = (type: ProjectType) => {
        setProjectType(type);
        setAmount(projectConfig[type].defaultAmount);
        setDuration(projectConfig[type].defaultDuration);
    };

    const { monthlyPayment, totalRepaid, totalInterest } = useMemo(() => {
        const annualRate = config.rate / 100;
        const monthlyRate = annualRate / 12;
        const numberOfMonths = duration * 12;

        if (monthlyRate === 0) {
            return { monthlyPayment: amount / numberOfMonths, totalRepaid: amount, totalInterest: 0 };
        }

        const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, numberOfMonths)) / (Math.pow(1 + monthlyRate, numberOfMonths) - 1);
        const totalRepaid = payment * numberOfMonths;
        const totalInterest = totalRepaid - amount;

        return { monthlyPayment: payment, totalRepaid, totalInterest };

    }, [amount, duration, projectType]);


    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8 animate-fade-in">
             <div className="container mx-auto max-w-6xl">
                 <div className="relative mb-8 text-center">
                    <button onClick={onGoHome} className="absolute top-1/2 left-0 -translate-y-1/2 text-horizon-blue-primary font-semibold hover:underline">
                        &larr; Retour à l'accueil
                    </button>
                    <h1 className="text-3xl md:text-4xl font-bold text-horizon-blue-primary">Simulateur de crédit</h1>
                 </div>

                <div className="grid lg:grid-cols-2 gap-8 items-start">
                    {/* Left Column: Form */}
                    <div className="bg-white p-8 rounded-xl shadow-lg">
                        <h2 className="text-xl font-bold text-horizon-blue-primary mb-6">1. Choisissez votre projet</h2>
                        <div className="grid grid-cols-3 gap-2 md:gap-4 mb-8">
                            {Object.entries(projectConfig).map(([key, value]) => (
                                <button key={key} onClick={() => handleProjectTypeChange(key as ProjectType)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all duration-200 ${projectType === key ? 'bg-horizon-blue-secondary border-horizon-blue-primary shadow-sm text-horizon-blue-primary' : 'border-gray-200 hover:border-gray-300 text-horizon-gray'}`}>
                                    {value.icon}
                                    <span className="mt-2 text-sm font-semibold text-center">{value.label}</span>
                                </button>
                            ))}
                        </div>

                         <h2 className="text-xl font-bold text-horizon-blue-primary mb-6">2. Définissez votre emprunt</h2>
                         <div className="space-y-8">
                            <div>
                                <label htmlFor="amount" className="block font-semibold mb-2">Montant à emprunter</label>
                                <input type="range" id="amount" min={config.minAmount} max={config.maxAmount} step={config.stepAmount} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-horizon-accent"/>
                                <div className="text-center font-bold text-2xl text-horizon-blue-primary mt-2">{formatCurrency(amount)}</div>
                            </div>
                            <div>
                                <label htmlFor="duration" className="block font-semibold mb-2">Durée de remboursement</label>
                                <input type="range" id="duration" min={config.minDuration} max={config.maxDuration} step={config.stepDuration} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-horizon-accent"/>
                                <div className="text-center font-bold text-2xl text-horizon-blue-primary mt-2">{formatYears(duration)}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Results */}
                    <div className="bg-white p-8 rounded-xl shadow-lg lg:sticky lg:top-8">
                        <h2 className="text-xl font-bold text-horizon-blue-primary mb-4 text-center">Votre simulation</h2>
                        <div className="bg-horizon-blue-primary text-white rounded-lg p-6 text-center my-4">
                            <h3 className="text-lg font-semibold opacity-80">Mensualité estimée</h3>
                            <p className="text-4xl md:text-5xl font-bold my-2">{formatCurrency(monthlyPayment)} / mois</p>
                            <p className="text-xs opacity-70">Taux d'intérêt fixe estimé de {config.rate}%*</p>
                        </div>
                        
                        <div className="flex justify-center items-center my-8">
                             <DonutChart principal={amount} interest={totalInterest} />
                        </div>

                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-center"><span className="text-gray-500 flex items-center"><span className="w-3 h-3 rounded-full bg-horizon-blue-secondary inline-block mr-2"></span>Montant emprunté</span> <span className="font-semibold">{formatCurrency(amount)}</span></div>
                            <div className="flex justify-between items-center"><span className="text-gray-500 flex items-center"><span className="w-3 h-3 rounded-full bg-horizon-accent inline-block mr-2"></span>Coût total du crédit</span> <span className="font-semibold">{formatCurrency(totalInterest)}</span></div>
                            <hr className="my-2"/>
                            <div className="flex justify-between items-center text-base"><span className="font-semibold">Montant total remboursé</span> <span className="font-bold text-horizon-blue-primary">{formatCurrency(totalRepaid)}</span></div>
                        </div>
                        
                        <p className="text-xs text-gray-400 text-center mt-6">* Simulation non contractuelle, susceptible de varier en fonction de votre situation personnelle.</p>
                        <button onClick={onApplyForLoanClick} className="w-full mt-6 bg-horizon-accent text-horizon-blue-primary px-6 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105">
                            Faire une demande de prêt
                        </button>
                    </div>
                </div>
             </div>
        </div>
    );
};

export default CreditSimulatorPage;