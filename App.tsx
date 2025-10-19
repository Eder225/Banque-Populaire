import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import FeatureSection from './components/FeatureSection';
import AccountOpening from './components/account_opening/AccountOpening';
import CreditSimulatorPage from './components/credit_simulator/CreditSimulatorPage';

// Import icons for feature sections
import { BanknotesIcon } from './components/icons/AccountIcon';
import { CreditCardIcon } from './components/icons/CreditCardIcon';
import { DevicePhoneMobileIcon } from './components/icons/MobileIcon';
import { HomeModernIcon } from './components/icons/MortgageIcon';
import { UserGroupIcon } from './components/icons/InsuranceIcon';
import { PercentIcon } from './components/icons/PercentIcon';
import { ArrowPathIcon } from './components/icons/ArrowPathIcon';
import { ChartPieIcon } from './components/icons/SavingsIcon';
import { ShieldCheckIcon } from './components/icons/SecurityIcon';
import { ChatBubbleLeftRightIcon } from './components/icons/ChatBubbleLeftRightIcon';
import { CarIcon } from './components/icons/CarIcon';
import { HealthIcon } from './components/icons/HealthIcon';


const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'login' | 'dashboard' | 'openAccount' | 'creditSimulator'>('home');

  const handleLoginClick = () => setView('login');
  const handleLoginSuccess = () => setView('dashboard');
  const handleGoHome = () => setView('home');
  const handleLogout = () => setView('home');
  const handleOpenAccountClick = () => setView('openAccount');
  const handleCreditSimulatorClick = () => setView('creditSimulator');

  if (view === 'login') {
    return <Login onLoginSuccess={handleLoginSuccess} onGoHome={handleGoHome} />;
  }
  
  if (view === 'dashboard') {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (view === 'openAccount') {
    return <AccountOpening onGoHome={handleGoHome} onAccountOpened={handleLoginClick} />;
  }

  if (view === 'creditSimulator') {
    return <CreditSimulatorPage onGoHome={handleGoHome} onApplyForLoanClick={handleOpenAccountClick} />;
  }

  return (
    <div className="bg-white font-sans text-horizon-gray">
      <Header onLoginClick={handleLoginClick} onLogoClick={handleGoHome} />
      <main>
        <Hero onOpenAccountClick={handleOpenAccountClick} onCreditSimulatorClick={handleCreditSimulatorClick} />

        <FeatureSection
          id="compte-courant"
          title="Un compte qui vous ressemble"
          description="Gérez votre argent en toute simplicité avec un compte courant adapté à vos besoins quotidiens. Profitez de services en ligne performants et de cartes bancaires internationales."
          imageUrl="https://picsum.photos/600/400?random=10"
          ctaText="Ouvrir un compte"
          onCtaClick={handleOpenAccountClick}
          features={[
            { icon: <BanknotesIcon className="w-8 h-8"/>, title: "Gestion 100% en ligne", description: "Consultez vos comptes et effectuez vos opérations 24/7." },
            { icon: <CreditCardIcon className="w-8 h-8"/>, title: "Cartes incluses", description: "Choisissez la carte qui vous convient : Visa Classic ou Premier." },
            { icon: <DevicePhoneMobileIcon className="w-8 h-8"/>, title: "Application intuitive", description: "Pilotez votre budget du bout des doigts, où que vous soyez." }
          ]}
        />
         <FeatureSection
          id="credit-immobilier"
          imagePosition="right"
          title="Votre projet immobilier commence ici"
          description="Devenez propriétaire avec un financement sur-mesure. Nos conseillers vous accompagnent à chaque étape pour trouver la solution la plus adaptée à votre situation et à votre projet."
          imageUrl="https://picsum.photos/600/400?random=11"
          ctaText="Faire une simulation"
          onCtaClick={handleCreditSimulatorClick}
          features={[
            { icon: <UserGroupIcon className="w-8 h-8"/>, title: "Conseiller dédié", description: "Un expert vous guide et optimise votre plan de financement." },
            { icon: <PercentIcon className="w-8 h-8"/>, title: "Taux compétitifs", description: "Bénéficiez de conditions d'emprunt avantageuses." },
            { icon: <ArrowPathIcon className="w-8 h-8"/>, title: "Remboursements flexibles", description: "Adaptez vos mensualités en fonction de l'évolution de vos revenus." }
          ]}
        />
         <FeatureSection
          id="epargne"
          title="Construisez votre avenir, euro après euro"
          description="Anticiper un projet, préparer sa retraite ou simplement mettre de l'argent de côté : nous avons les solutions d'épargne qui vous correspondent pour valoriser votre capital en toute sérénité."
          imageUrl="https://picsum.photos/600/400?random=12"
          ctaText="Découvrir nos solutions"
          features={[
            { icon: <ChartPieIcon className="w-8 h-8"/>, title: "Solutions diversifiées", description: "Livret A, assurance-vie, plans d'épargne... Un large choix de placements." },
            { icon: <ShieldCheckIcon className="w-8 h-8"/>, title: "Épargne sécurisée", description: "Des produits garantis pour faire fructifier votre argent sans risque." },
            { icon: <ChatBubbleLeftRightIcon className="w-8 h-8"/>, title: "Conseils en investissement", description: "Nos experts vous aident à définir votre stratégie patrimoniale." }
          ]}
        />
         <FeatureSection
          id="assurances"
          imagePosition="right"
          title="Protégez ce qui compte le plus pour vous"
          description="Parce que la vie est faite d'imprévus, nos solutions d'assurance protègent votre famille, vos biens et votre santé. Composez une protection sur-mesure pour vivre l'esprit tranquille."
          imageUrl="https://picsum.photos/600/400?random=13"
          ctaText="Obtenir un devis"
          features={[
            { icon: <CarIcon className="w-8 h-8"/>, title: "Assurance Auto", description: "Des garanties complètes pour tous vos déplacements." },
            { icon: <HomeModernIcon className="w-8 h-8"/>, title: "Assurance Habitation", description: "Votre domicile et vos biens protégés contre tous les risques." },
            { icon: <HealthIcon className="w-8 h-8"/>, title: "Complémentaire Santé", description: "Des remboursements adaptés à vos besoins de santé." }
          ]}
        />
        
      </main>
      <Footer />
    </div>
  );
};

export default App;