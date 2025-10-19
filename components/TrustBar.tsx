
import React from 'react';
import { CheckCircleIcon } from './icons/CheckIcon';
import { DevicePhoneMobileIcon } from './icons/MobileIcon';
import { ShieldCheckIcon } from './icons/SecurityIcon';


const TrustItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3">
    <div className="text-horizon-blue-primary">{icon}</div>
    <span className="font-medium text-sm md:text-base">{text}</span>
  </div>
);

const TrustBar: React.FC = () => {
  return (
    <div className="bg-horizon-blue-secondary">
      <div className="container mx-auto px-6 py-6 flex flex-wrap justify-around items-center gap-6">
        <TrustItem icon={<CheckCircleIcon className="w-7 h-7" />} text="2 millions de clients nous font confiance" />
        <TrustItem icon={<DevicePhoneMobileIcon className="w-7 h-7" />} text="Application mobile notée 4.8/5" />
        <TrustItem icon={<ShieldCheckIcon className="w-7 h-7" />} text="Sécurité renforcée" />
      </div>
    </div>
  );
};

export default TrustBar;
