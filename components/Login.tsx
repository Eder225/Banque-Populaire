import React, { useState } from 'react';
import { LockClosedIcon } from './icons/LockIcon';
import { getUserData } from '../database';
import { CheckCircleIcon } from './icons/CheckIcon';

interface LoginProps {
  onLoginSuccess: () => void;
  onGoHome: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onGoHome }) => {
  const [mode, setMode] = useState<'login' | 'recover' | 'recover_success'>('login');
  
  // Login states
  const [clientId, setClientId] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Recovery states
  const [recoveryClientId, setRecoveryClientId] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [recoveryIsLoading, setRecoveryIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const userData = getUserData();

    if (clientId !== userData.id || secretCode !== userData.secretCode) {
        setError('Identifiant client ou code secret incorrect.');
        return;
    }
    
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
    }, 1500);
  };

  const handleRecoverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');
    setRecoveryIsLoading(true);

    // Simulate API call and validation
    setTimeout(() => {
      const userData = getUserData();
      if (recoveryClientId === userData.id) {
        setMode('recover_success');
      } else {
        setRecoveryError('Cet identifiant client n\'a pas été trouvé.');
      }
      setRecoveryIsLoading(false);
    }, 1200);
  };

  const handleBackToLogin = () => {
    setMode('login');
    // Reset all fields and errors
    setError('');
    setRecoveryError('');
    setClientId('');
    setSecretCode('');
    setRecoveryClientId('');
  };

  const renderContent = () => {
    switch(mode) {
      case 'recover':
        return (
          <div className="animate-fade-in">
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-horizon-blue-primary">Récupération d'identifiants</h1>
              <p className="text-horizon-gray mt-2 text-base">Saisissez votre identifiant pour lancer la procédure.</p>
            </div>
            <form onSubmit={handleRecoverySubmit} className="space-y-6">
              <div>
                <label htmlFor="recoveryClientId" className="block text-sm font-medium text-gray-700">Identifiant client</label>
                <div className="mt-1">
                  <input
                    id="recoveryClientId"
                    name="recoveryClientId"
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    required
                    value={recoveryClientId}
                    onChange={(e) => setRecoveryClientId(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary text-base"
                    placeholder="Votre identifiant à 11 chiffres"
                  />
                </div>
              </div>
              {recoveryError && <p className="text-xs text-center text-red-600 bg-red-50 p-2 rounded-md">{recoveryError}</p>}
              <div>
                <button type="submit" disabled={recoveryIsLoading} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-horizon-blue-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-horizon-blue-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors">
                  {recoveryIsLoading ? 'Vérification...' : 'Continuer'}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
              <button onClick={handleBackToLogin} className="text-base font-medium text-horizon-blue-primary hover:underline">
                Retour à la connexion
              </button>
            </div>
          </div>
        );
      case 'recover_success':
        return (
          <div className="animate-fade-in text-center flex flex-col justify-center h-full">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-horizon-blue-primary">Procédure lancée</h1>
            <p className="text-horizon-gray mt-4 text-base max-w-sm mx-auto">
              Si votre identifiant est correct, un nouveau code secret temporaire vous a été envoyé par e-mail.
            </p>
            <div className="mt-8">
              <button onClick={handleBackToLogin} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-horizon-blue-primary hover:bg-opacity-90 transition-colors">
                Retour à la connexion
              </button>
            </div>
          </div>
        );
      case 'login':
      default:
        return (
           <div className="animate-fade-in">
            <div className="text-left mb-8">
              <h1 className="text-3xl font-bold text-horizon-blue-primary">Accès Client</h1>
              <p className="text-horizon-gray mt-2 text-base">Connectez-vous à votre espace sécurisé.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                  Identifiant client
                </label>
                <div className="mt-1">
                  <input
                    id="clientId"
                    name="clientId"
                    type="text"
                    inputMode="numeric"
                    maxLength={11}
                    autoComplete="username"
                    required
                    value={clientId}
                    onChange={(e) => setClientId(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary text-base"
                    placeholder="Votre identifiant"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="secretCode" className="block text-sm font-medium text-gray-700">
                  Code secret
                </label>
                <div className="mt-1">
                  <input
                    id="secretCode"
                    name="secretCode"
                    type="password"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    autoComplete="current-password"
                    required
                    value={secretCode}
                    onChange={(e) => setSecretCode(e.target.value.replace(/\D/g, ''))}
                    className="appearance-none block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-horizon-blue-primary focus:border-horizon-blue-primary text-base"
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;"
                  />
                </div>
              </div>
              
              {error && <p className="text-xs text-center text-red-600 bg-red-50 p-2 rounded-md">{error}</p>}
              
              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium text-white bg-horizon-blue-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-horizon-blue-primary disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? 'Connexion en cours...' : (
                    <>
                      <LockClosedIcon className="w-5 h-5 mr-2 -ml-1" />
                      Se connecter
                    </>
                  )}
                </button>
              </div>
            </form>
            <div className="mt-8 text-center">
                <button onClick={() => setMode('recover')} className="text-base font-medium text-horizon-blue-primary hover:underline">
                  Identifiants perdus ?
                </button>
            </div>
          </div>
        );
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 animate-fade-in relative">
      <div className="absolute top-8 left-8">
        <button onClick={onGoHome} className="text-horizon-blue-primary font-semibold hover:underline">
          &larr; Retour à l'accueil
        </button>
      </div>
      <div className="w-full max-w-4xl grid md:grid-cols-2 items-center shadow-2xl rounded-xl overflow-hidden">
        <div className="p-8 md:p-12 bg-white">
          {renderContent()}
        </div>
        <div className="hidden md:block h-full">
            <img src="https://picsum.photos/800/1200?random=1" alt="Personne utilisant des services bancaires en ligne" className="object-cover w-full h-full"/>
        </div>
      </div>
    </div>
  );
};

export default Login;