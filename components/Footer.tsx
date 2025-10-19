
import React from 'react';
import { FacebookIcon, TwitterIcon, LinkedinIcon } from './icons/SocialIcons';

const FooterLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <li>
    <a href={href} className="text-gray-500 hover:text-horizon-blue-primary transition-colors">
      {children}
    </a>
  </li>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-sm">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="font-bold text-horizon-blue-primary mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Nous découvrir</FooterLink>
              <FooterLink href="#">Nos engagements</FooterLink>
              <FooterLink href="#">Carrières</FooterLink>
              <FooterLink href="#">Espace presse</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-horizon-blue-primary mb-4">Aide et contact</h4>
            <ul className="space-y-2">
              <FooterLink href="#">FAQ</FooterLink>
              <FooterLink href="#">Contactez-nous</FooterLink>
              <FooterLink href="#">Trouver une agence</FooterLink>
              <FooterLink href="#">Numéros d'urgence</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-horizon-blue-primary mb-4">Informations légales</h4>
            <ul className="space-y-2">
              <FooterLink href="#">Mentions légales</FooterLink>
              <FooterLink href="#">Tarifs</FooterLink>
              <FooterLink href="#">Sécurité</FooterLink>
              <FooterLink href="#">Gestion des cookies</FooterLink>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-horizon-blue-primary mb-4">Suivez-nous</h4>
            <div className="flex space-x-4 mb-4">
                <a href="#" className="text-gray-500 hover:text-horizon-blue-primary"><FacebookIcon className="w-6 h-6" /></a>
                <a href="#" className="text-gray-500 hover:text-horizon-blue-primary"><TwitterIcon className="w-6 h-6" /></a>
                <a href="#" className="text-gray-500 hover:text-horizon-blue-primary"><LinkedinIcon className="w-6 h-6" /></a>
            </div>
             <h4 className="font-bold text-horizon-blue-primary mt-6 mb-2">Nos applications</h4>
             <a href="#" className="inline-block">
                <img src="https://via.placeholder.com/135x40.png?text=App+Store" alt="Download on the App Store" className="h-10"/>
             </a>
             <a href="#" className="inline-block mt-2">
                <img src="https://via.placeholder.com/135x40.png?text=Google+Play" alt="Get it on Google Play" className="h-10"/>
             </a>
          </div>
        </div>
      </div>
      <div className="bg-gray-200 py-4">
        <div className="container mx-auto px-6 text-center text-gray-600">
          © {currentYear} Banque Populaire - Tous droits réservés.
        </div>
      </div>
    </footer>
  );
};

export default Footer;