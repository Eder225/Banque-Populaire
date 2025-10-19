import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '../icons/PaperAirplaneIcon';
import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini AI model
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface Message {
    id: number;
    text: string;
    sender: 'user' | 'ai';
}

const AITypingIndicator: React.FC = () => (
    <div className="flex gap-3">
        <div className="w-8 h-8 bg-horizon-accent rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">SL</div>
        <div className="bg-gray-200 p-3 rounded-lg max-w-md flex items-center">
            <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
            </div>
        </div>
    </div>
);


const Messagerie: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, text: "Bonjour, je suis Sophie, votre conseillère virtuelle. Comment puis-je vous aider aujourd'hui ?", sender: 'ai' }
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Auto-scroll to the bottom of the chat
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim() === '' || isLoading) return;

        const userMessage: Message = {
            id: Date.now(),
            text: newMessage,
            sender: 'user',
        };

        setMessages(prev => [...prev, userMessage]);
        setNewMessage('');
        setIsLoading(true);

        try {
            // Build the conversation history for the AI
            // @google/genai-ts FIX: The `parts` property must be an array of `Part` objects, not a plain string.
            const contents = messages.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }],
            }));
            contents.push({ role: 'user', parts: [{ text: userMessage.text }] });

            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: contents,
                config: {
                    systemInstruction: "Tu es Sophie Leroy, une conseillère bancaire amicale, professionnelle et serviable pour la Banque Populaire. Tes réponses doivent être claires, concises et toujours aimables. N'utilise pas le format Markdown.",
                },
            });

            const aiResponseText = response.text;

            const aiMessage: Message = {
                id: Date.now() + 1,
                text: aiResponseText,
                sender: 'ai',
            };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("Error communicating with AI:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Désolée, je rencontre un problème technique. Veuillez réessayer plus tard.",
                sender: 'ai',
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="animate-fade-in">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-horizon-blue-primary">Messagerie sécurisée</h1>
                <p className="text-gray-500 mt-1">Échangez avec votre conseiller en toute confidentialité.</p>
            </header>

            <div className="bg-white rounded-xl shadow-md flex" style={{height: '70vh'}}>
                {/* Conversations List */}
                <div className="w-1/3 border-r border-gray-100 hidden md:block">
                    <div className="p-4 border-b border-gray-100">
                        <input type="text" placeholder="Rechercher..." className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-horizon-blue-primary" />
                    </div>
                    <ul>
                        <li className="p-4 border-b border-gray-100 bg-horizon-blue-secondary cursor-pointer">
                            <h3 className="font-bold text-horizon-blue-primary">Sophie Leroy (IA)</h3>
                            <p className="text-sm text-horizon-gray truncate">{messages.length > 0 ? messages[messages.length - 1].text : "Commencez la conversation..."}</p>
                        </li>
                         <li className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer opacity-50">
                            <h3 className="font-bold text-horizon-blue-primary">Service Client</h3>
                            <p className="text-sm text-gray-500 truncate">Votre demande a bien été prise en compte.</p>
                        </li>
                    </ul>
                </div>

                {/* Chat Window */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                         <div className="w-10 h-10 bg-horizon-accent rounded-full flex items-center justify-center font-bold text-white">SL</div>
                         <div>
                            <h2 className="font-bold text-horizon-blue-primary">Sophie Leroy (IA)</h2>
                            <p className="text-xs text-green-600 flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                En ligne
                            </p>
                         </div>
                    </div>
                    <div ref={chatContainerRef} className="flex-grow p-6 space-y-4 overflow-y-auto bg-gray-50">
                        {messages.map((message) => 
                            message.sender === 'ai' ? (
                                <div key={message.id} className="flex gap-3">
                                    <div className="w-8 h-8 bg-horizon-accent rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0">SL</div>
                                    <div className="bg-gray-200 p-3 rounded-lg max-w-md">
                                        <p className="text-sm text-horizon-gray">{message.text}</p>
                                    </div>
                                </div>
                            ) : (
                                 <div key={message.id} className="flex gap-3 justify-end">
                                     <div className="bg-horizon-blue-primary text-white p-3 rounded-lg max-w-md">
                                        <p className="text-sm">{message.text}</p>
                                    </div>
                                 </div>
                            )
                        )}
                        {isLoading && <AITypingIndicator />}
                    </div>
                    <div className="p-4 bg-white border-t border-gray-100">
                        <form onSubmit={handleSendMessage} className="relative">
                            <input 
                                type="text" 
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Écrivez votre message..." 
                                className="w-full pr-12 px-4 py-3 text-sm border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-horizon-blue-primary disabled:bg-gray-100" 
                                disabled={isLoading}
                            />
                            <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 bg-horizon-blue-primary text-white p-2 rounded-full hover:bg-opacity-90 disabled:bg-gray-400" disabled={isLoading || !newMessage.trim()}>
                                <PaperAirplaneIcon className="w-5 h-5" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messagerie;
