import React, { useRef } from 'react';
import { User, Transaction } from '../../database';
import { LogoIcon } from '../icons/LogoIcon';
import { CheckCircleIcon } from '../icons/CheckIcon';
import { DocumentArrowDownIcon } from '../icons/DocumentArrowDownIcon';

// Since jspdf is loaded from a CDN, we need to assert its presence on the window object
declare global {
    interface Window {
        jspdf: any;
        html2canvas: any;
    }
}

interface TransactionReceiptProps {
    transaction: Transaction;
    user: User;
    onClose: () => void;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(value);
};

const DetailRow: React.FC<{ label: string; value: string | undefined }> = ({ label, value }) => (
    <div className="flex justify-between py-3 border-b border-dashed border-gray-200">
        <span className="text-sm text-gray-500">{label}</span>
        <span className="text-sm font-semibold text-horizon-gray">{value || 'N/A'}</span>
    </div>
);

const TransactionReceipt: React.FC<TransactionReceiptProps> = ({ transaction, user, onClose }) => {
    const receiptRef = useRef<HTMLDivElement>(null);
    const { details } = transaction;

    const handleDownloadPdf = () => {
        const input = receiptRef.current;
        if (!input || !window.jspdf || !window.html2canvas) {
            console.error("PDF generation libraries not loaded.");
            return;
        };

        window.html2canvas(input, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new window.jspdf.jsPDF({
                    orientation: 'portrait',
                    unit: 'pt',
                    format: 'a4'
                });
                
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const imgProps= pdf.getImageProperties(imgData);
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save(`Recu_Virement_${transaction.date.replace(/\//g, '-')}.pdf`);
            });
    };

    return (
        <div className="animate-fade-in flex flex-col items-center justify-center bg-gray-50 p-4">
             <div className="w-full max-w-2xl">
                <div ref={receiptRef} className="bg-white p-8 md:p-12 rounded-xl shadow-lg">
                    <header className="flex justify-between items-center pb-6 border-b border-gray-200">
                        <div className="flex items-center gap-3 text-xl font-bold text-horizon-blue-primary">
                            <LogoIcon className="w-8 h-8"/>
                            <span>Banque Populaire</span>
                        </div>
                        <span className="text-xs text-gray-400">Reçu de transaction</span>
                    </header>
                    <main className="py-8">
                        <div className="text-center mb-8">
                            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-3"/>
                            <h1 className="text-2xl font-bold text-horizon-blue-primary">Virement effectué avec succès</h1>
                            <p className="text-gray-500 mt-1">Votre ordre de virement a été exécuté.</p>
                        </div>

                        <div className="bg-horizon-blue-secondary rounded-lg p-6 text-center mb-8">
                            <span className="text-sm text-horizon-blue-primary">Montant du virement</span>
                            <p className="text-4xl font-extrabold text-horizon-blue-primary">{formatCurrency(Math.abs(transaction.amount))}</p>
                        </div>
                        
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-horizon-blue-primary mb-2">Détails de l'opération</h2>
                            <DetailRow label="N° de transaction" value={transaction.id} />
                            <DetailRow label="Date et heure" value={`${transaction.date} à ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit'})}`} />
                            <DetailRow label="Motif" value={details?.reason} />
                            {details?.recipientEmail && <DetailRow label="Notification par e-mail" value={details.recipientEmail} />}
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 mt-8">
                            <div>
                                <h3 className="font-semibold text-horizon-blue-primary mb-3">Compte débité</h3>
                                <p className="text-sm text-horizon-gray">{details?.senderName}</p>
                                <p className="text-sm text-gray-500">Compte Courant</p>
                                <p className="text-sm text-gray-500 font-mono">{details?.senderIban}</p>
                            </div>
                             <div>
                                <h3 className="font-semibold text-horizon-blue-primary mb-3">Compte crédité</h3>
                                <p className="text-sm text-horizon-gray">{details?.recipientName}</p>
                                <p className="text-sm text-gray-500">Compte Externe</p>
                                <p className="text-sm text-gray-500 font-mono">{details?.recipientIban}</p>
                            </div>
                        </div>
                    </main>
                    <footer className="pt-6 text-center text-xs text-gray-400 border-t border-gray-200">
                        Ce document est un justificatif de votre opération. Conservez-le précieusement.
                    </footer>
                </div>
                <div className="flex justify-center gap-4 mt-8">
                    <button 
                        onClick={onClose}
                        className="px-6 py-3 bg-white border border-gray-300 rounded-lg font-semibold text-horizon-gray hover:bg-gray-50 transition-colors">
                        Retour au tableau de bord
                    </button>
                    <button 
                        onClick={handleDownloadPdf}
                        className="flex items-center gap-2 px-6 py-3 bg-horizon-blue-primary text-white rounded-lg font-semibold hover:bg-opacity-90 transition-transform hover:scale-105">
                        <DocumentArrowDownIcon className="w-5 h-5"/>
                        Télécharger en PDF
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TransactionReceipt;