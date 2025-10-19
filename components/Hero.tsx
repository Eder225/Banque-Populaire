
import React from 'react';

interface HeroProps {
  onOpenAccountClick: () => void;
  onCreditSimulatorClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenAccountClick, onCreditSimulatorClick }) => {
  return (
    <section 
      className="relative bg-cover bg-center text-white py-32 md:py-48" 
      style={{ backgroundImage: "url('https://picsum.photos/1920/1080?grayscale&blur=2')" }}
    >
      <div className="absolute inset-0 bg-horizon-blue-primary bg-opacity-60"></div>
      <div className="container mx-auto px-6 relative z-10 text-center">
        <h1 className="text-4xl md:text-6xl font-extrapold !leading-tight mb-4 animate-fade-in-up">
          Donnez de l'élan à vos projets de vie.
        </h1>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 animate-fade-in-up animation-delay-300">
          Avec Banque Populaire, bénéficiez de solutions sur-mesure et d'un accompagnement personnalisé pour réaliser tous vos projets.
        </p>
        <div className="flex justify-center gap-4 flex-wrap animate-fade-in-up animation-delay-600">
          <button onClick={onOpenAccountClick} className="bg-horizon-accent text-horizon-blue-primary px-8 py-3 rounded-full font-bold hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg">
            Ouvrir un compte en ligne
          </button>
          <button onClick={onCreditSimulatorClick} className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white hover:text-horizon-blue-primary transition-all duration-300">
            Simuler un crédit
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
