
import React from 'react';

interface DonutChartProps {
    principal: number;
    interest: number;
    size?: number;
    strokeWidth?: number;
}

const DonutChart: React.FC<DonutChartProps> = ({
    principal,
    interest,
    size = 180,
    strokeWidth = 20
}) => {
    const total = principal + interest;
    if (total === 0) return null;

    const principalPercentage = (principal / total) * 100;
    const interestPercentage = (interest / total) * 100;

    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const principalStrokeDashoffset = circumference - (principalPercentage / 100) * circumference;
    const interestStrokeDashoffset = 0; // Starts where the principal ends

    return (
        <div style={{ width: size, height: size }} className="relative">
            <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
                {/* Background Circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#eaf4f4"
                    strokeWidth={strokeWidth}
                />
                
                {/* Principal Segment */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#013a63"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={principalStrokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 ease-out"
                />
                
                 {/* Interest Segment - drawn on top, appears "after" */}
                 <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="transparent"
                    stroke="#fca311"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference - (interestPercentage / 100) * circumference}
                    transform={`rotate(${principalPercentage * 3.6} ${size/2} ${size/2})`}
                    strokeLinecap="round"
                     className="transition-all duration-500 ease-out"
                />
            </svg>
             <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-xs text-gray-500">Total</span>
                <span className="text-2xl font-bold text-horizon-blue-primary">
                    {new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(total)}
                </span>
            </div>
        </div>
    );
};

export default DonutChart;
