import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const N8N_WEBHOOK_URL = 'https://n8n-turin-n8n.fcimcq.easypanel.host/webhook/Paginabot';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Scroll automático al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Mensaje de bienvenida al abrir el chat
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setTimeout(() => {
                addBotMessage('¡Hola! 👋 Bienvenido a TAKEOFF AUTO. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?');
            }, 500);
        }
    }, [isOpen]);

    // Listen for custom event to open chatbot
    useEffect(() => {
        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    const addBotMessage = (text, action = null) => {
        setMessages(prev => [...prev, {
            text,
            sender: 'bot',
            timestamp: new Date(),
            action
        }]);
    };

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, {
            text,
            sender: 'user',
            timestamp: new Date()
        }]);
    };

    // Enviar mensaje al webhook de n8n y obtener respuesta
    const getBotResponseFromN8N = async (userMessage) => {
        try {
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    sessionId: 'web-chat-' + Date.now(),
                }),
            });

            if (!response.ok) {
                throw new Error(`Error ${response.status}`);
            }

            const data = await response.json();

            // n8n puede devolver la respuesta en diferentes formatos
            // Intentamos los más comunes
            const botText = data.output
                || data.response
                || data.message
                || data.text
                || data.reply
                || (typeof data === 'string' ? data : JSON.stringify(data));

            return botText;
        } catch (error) {
            console.error('Error al contactar al agente:', error);
            return 'Lo siento, tuve un problema al procesar tu mensaje. Por favor intentá de nuevo en unos segundos.';
        }
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '' || isTyping) return;

        // Agregar mensaje del usuario
        const userMsg = inputValue;
        addUserMessage(userMsg);
        setInputValue('');

        // Mostrar indicador de "escribiendo..."
        setIsTyping(true);

        // Llamar al webhook de n8n
        const botResponse = await getBotResponseFromN8N(userMsg);

        setIsTyping(false);
        addBotMessage(botResponse);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    const handleQuickAction = (message, link) => {
        if (link) {
            navigate(link);
            setIsOpen(false);
        }
    };

    // Quick buttons que envían al webhook de n8n
    const handleQuickButton = async (displayText) => {
        if (isTyping) return;
        addUserMessage(displayText);
        setIsTyping(true);
        const botResponse = await getBotResponseFromN8N(displayText);
        setIsTyping(false);
        addBotMessage(botResponse);
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={30} color="white" />
                </button>
            )}

            {isOpen && (
                <div className="chat-window">
                    <div className="chat-header">
                        <div className="chat-title">
                            <div className="chat-avatar">T</div>
                            <div className="chat-info">
                                <h4>Auto Asistente</h4>
                                <p>TAKEOFF AUTO • En línea</p>
                            </div>
                        </div>
                        <button className="chat-close" onClick={() => setIsOpen(false)} title="Cerrar chat">
                            <X size={20} color="white" />
                        </button>
                    </div>

                    <div className="chat-body">
                        {messages.map((message, index) => (
                            <div key={index}>
                                <div className={`message ${message.sender === 'bot' ? 'bot-message' : 'user-message'}`}>
                                    {message.text}
                                </div>
                                {message.action && (
                                    <button
                                        className="quick-action-btn"
                                        onClick={() => handleQuickAction(message.action.text, message.action.link)}
                                    >
                                        {message.action.text} →
                                    </button>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot-message typing-indicator">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">

                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={isTyping}
                            />
                            <button className="btn-send" onClick={handleSendMessage} disabled={isTyping}>
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
