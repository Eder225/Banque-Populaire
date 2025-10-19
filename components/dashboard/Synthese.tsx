import React, { useState, useEffect } from 'react';
import { WalletIcon } from '../icons/WalletIcon';
import { ChartBarIcon } from '../icons/ChartBarIcon';
import { User } from '../../database';

const weeklySpendingData = [
    { label: 'Lun', value: 65.40 }, { label: 'Mar', value: 59.12 }, { label: 'Mer', value: 80.75 },
    { label: 'Jeu', value: 81.33 }, { label: 'Ven', value: 156.90 }, { label: 'Sam', value: 125.22 }, { label: 'Dim', value: 40.50 }
];

const monthlySpendingData = [
    { label: 'Fév', value: 1600 }, { label: 'Mar', value: 1520 }, { label: 'Avr', value: 1800 },
    { label: 'Mai', value: 1750 }, { label: 'Juin', value: 2100 }, { label: 'Juil', value: 1950 }
];


const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const StatCard: React.FC<{ icon: React.ReactNode, title: string, amount: string }> = ({ icon, title, amount }) => (
    <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
        <div className="bg-horizon-blue-secondary p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-horizon-gray font-medium">{title}</p>
            <p className="text-2xl font-bold text-horizon-blue-primary">{amount}</p>
        </div>
    </div>
);

interface BarChartProps {
  data: { label: string; value: number }[];
  onMouseOver: (e: React.MouseEvent<HTMLDivElement>, data: { label: string; value: number }) => void;
  onMouseOut: () => void;
}

const BarChart: React.FC<BarChartProps> = ({ data, onMouseOver, onMouseOut }) => {
    const maxVal = Math.max(...data.map(d => d.value), 0);

    return (
        <div className="flex justify-between items-end h-48 pt-4">
            {data.map(item => (
                <div key={item.label} className="flex flex-col items-center w-full group">
                    <div 
                        className="w-full max-w-8 bg-horizon-blue-primary rounded-t-md hover:bg-horizon-accent transition-colors"
                        style={{ height: `${(item.value / maxVal) * 100}%`}}
                        onMouseOver={(e) => onMouseOver(e, item)}
                        onMouseOut={onMouseOut}
                    ></div>
                    <span className="text-xs font-semibold text-gray-500 mt-2">{item.label}</span>
                </div>
            ))}
        </div>
    );
};

interface SyntheseProps {
    userData: User;
    highlightedTxId: string | null;
    onHighlightComplete: () => void;
}

const Synthese: React.FC<SyntheseProps> = ({ userData, highlightedTxId, onHighlightComplete }) => {
    const [chartView, setChartView] = useState<'weekly' | 'monthly'>('weekly');
    const [tooltip, setTooltip] = useState<{ content: string; x: number; y: number } | null>(null);

    useEffect(() => {
        if (highlightedTxId) {
            const timer = setTimeout(() => {
                onHighlightComplete();
            }, 2000); // Duration of the highlight animation
            return () => clearTimeout(timer);
        }
    }, [highlightedTxId, onHighlightComplete]);


    const chartData = chartView === 'weekly' ? weeklySpendingData : monthlySpendingData;
    const chartTitle = chartView === 'weekly' ? 'Dépenses de la semaine' : 'Dépenses des 6 derniers mois';
    
    const handleMouseOver = (e: React.MouseEvent<HTMLDivElement>, data: { label: string; value: number }) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setTooltip({
            content: `${data.label}: ${formatCurrency(data.value)}`,
            x: rect.left + window.scrollX + rect.width / 2,
            y: rect.top + window.scrollY - 10,
        });
    };

    const handleMouseOut = () => {
        setTooltip(null);
    };

    return (
        <div className="animate-fade-in relative">
            {tooltip && (
                <div
                    className="absolute z-10 px-3 py-1.5 text-sm font-semibold text-white bg-gray-900 rounded-md shadow-lg -translate-x-1/2 -translate-y-full pointer-events-none"
                    style={{ left: tooltip.x, top: tooltip.y }}
                >
                    {tooltip.content}
                </div>
            )}
           
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard icon={<WalletIcon className="w-7 h-7 text-horizon-blue-primary" />} title="Solde Compte Courant" amount={formatCurrency(userData.accounts.courant.balance)} />
                <StatCard icon={<WalletIcon className="w-7 h-7 text-horizon-blue-primary" />} title="Livret A" amount={formatCurrency(userData.accounts.livretA.balance)} />
                 <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center text-center">
                    <p className="text-sm text-horizon-gray font-medium">Prochaine échéance de prêt</p>
                    <p className="text-2xl font-bold text-horizon-accent">{formatCurrency(450.00)}</p>
                    <p className="text-xs text-gray-400">le 05/08/2024</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md">
                    <h2 className="text-lg font-bold text-horizon-blue-primary mb-4">Dernières opérations</h2>
                    <ul className="divide-y divide-gray-100">
                         {userData.transactions.slice(0, 5).map((tx) => (
                            <li key={tx.id} className={`py-3 flex justify-between items-center transition-colors duration-300 ${tx.id === highlightedTxId ? 'animate-highlight-new' : ''}`}>
                                <div>
                                    <p className="font-medium text-horizon-gray">{tx.description}</p>
                                    <p className="text-sm text-gray-500">{tx.date}</p>
                                </div>
                                <p className={`font-semibold text-base ${tx.type === 'credit' ? 'text-green-600' : 'text-horizon-gray'}`}>
                                    {tx.type === 'credit' && '+'}{formatCurrency(tx.amount)}
                                </p>
                            </li>
                        ))}
                    </ul>
                     <div className="text-right mt-4">
                        <a href="#" className="font-semibold text-sm text-horizon-accent hover:underline">Voir plus &rarr;</a>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                         <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <ChartBarIcon className="w-6 h-6 text-horizon-blue-primary"/>
                                <h2 className="text-lg font-bold text-horizon-blue-primary">{chartTitle}</h2>
                            </div>
                            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-full">
                                <button 
                                    onClick={() => setChartView('weekly')} 
                                    className={`px-2 py-1 text-xs font-bold rounded-full transition-all ${chartView === 'weekly' ? 'bg-white text-horizon-blue-primary shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    Semaine
                                </button>
                                <button 
                                    onClick={() => setChartView('monthly')}
                                    className={`px-2 py-1 text-xs font-bold rounded-full transition-all ${chartView === 'monthly' ? 'bg-white text-horizon-blue-primary shadow-sm' : 'text-gray-500 hover:bg-gray-200'}`}
                                >
                                    Mois
                                </button>
                            </div>
                         </div>
                        <BarChart data={chartData} onMouseOver={handleMouseOver} onMouseOut={handleMouseOut} />
                    </div>
                     <div className="bg-white p-6 rounded-xl shadow-md">
                       <h2 className="text-lg font-bold text-horizon-blue-primary mb-4">Besoin d'aide ?</h2>
                       <button className="w-full bg-horizon-accent text-horizon-blue-primary px-5 py-3 rounded-lg font-bold hover:bg-opacity-90 transition-transform hover:scale-105">
                            Contacter mon conseiller
                        </button>
                   </div>
                </div>
            </div>
        </div>
    );
};

export default Synthese;