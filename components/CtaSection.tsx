
import React from 'react';

const CtaSection: React.FC = () => {
  return (
    <section className="bg-horizon-blue-primary text-white">
      <div className="container mx-auto px-6 py-16 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Prêt à nous rejoindre ?</h2>
        <p className="text-lg max-w-2xl mx-auto mb-8">
          Ouvrir un compte n'a jamais été aussi simple et rapide. Rejoignez Banque Populaire et profitez de tous vos avantages.
        </p>
        <button className="bg-horizon-accent text-horizon-blue-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-opacity-90 transition-transform hover:scale-105 shadow-lg">
          Devenir client
        </button>
      </div>
    </section>
  );
};

export default CtaSection;