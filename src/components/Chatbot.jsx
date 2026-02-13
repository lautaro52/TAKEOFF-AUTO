import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Chatbot.css';

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    // Respuestas automáticas del bot
    const botResponses = {
        comprar: {
            keywords: ['comprar', 'compra', 'auto', 'vehiculo', 'carro', 'catalogo'],
            response: '¡Excelente! Tenemos más de 15 autos disponibles. ¿Te gustaría ver nuestro catálogo completo?',
            action: { text: 'Ver catálogo', link: '/catalogo' }
        },
        vender: {
            keywords: ['vender', 'venta', 'vendo mi auto', 'quiero vender'],
            response: '¡Perfecto! En TAKEOFF AUTO compramos tu auto al mejor precio. Te hacemos una oferta en minutos.',
            action: { text: 'Vender mi auto', link: '/vender' }
        },
        financiamiento: {
            keywords: ['financiar', 'credito', 'prestamo', 'financiamiento', 'cuotas'],
            response: 'Contamos con planes de financiamiento flexibles. ¿Te gustaría conocer nuestras opciones de crédito?',
            action: { text: 'Ver opciones', link: '/credito' }
        },
        precios: {
            keywords: ['precio', 'cuanto', 'costo', 'vale'],
            response: 'Nuestros precios son muy competitivos. Los autos van desde $300,000 hasta $650,000. ¿Buscas algo en particular?',
        },
        saludo: {
            keywords: ['hola', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey'],
            response: '¡Hola! 👋 Soy el asistente virtual de TAKEOFF AUTO. ¿En qué puedo ayudarte hoy?',
        },
        ayuda: {
            keywords: ['ayuda', 'como', 'que puedes'],
            response: 'Puedo ayudarte con: Comprar un auto, Vender tu auto, Información de financiamiento, Precios y modelos disponibles. ¿Qué te interesa?',
        },
        default: {
            response: 'Interesante pregunta. Te recomiendo explorar nuestro catálogo o contactar con nuestros asesores para más información personalizada. ¿Puedo ayudarte con algo más?',
        }
    };

    // Scroll automático al último mensaje
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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

    const getBotResponse = (userMessage) => {
        const lowerMessage = userMessage.toLowerCase();

        // Buscar coincidencias en las keywords
        for (const [key, data] of Object.entries(botResponses)) {
            if (key !== 'default' && data.keywords.some(keyword => lowerMessage.includes(keyword))) {
                return { response: data.response, action: data.action };
            }
        }

        return { response: botResponses.default.response, action: null };
    };

    const handleSendMessage = () => {
        if (inputValue.trim() === '') return;

        // Agregar mensaje del usuario
        addUserMessage(inputValue);
        const userMsg = inputValue;
        setInputValue('');

        // Simular "escribiendo..." y responder
        setTimeout(() => {
            const { response, action } = getBotResponse(userMsg);
            addBotMessage(response, action);
        }, 800);
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
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        <div className="quick-actions">
                            <button
                                className="quick-btn"
                                onClick={() => {
                                    addUserMessage('Quiero comprar un auto');
                                    setTimeout(() => {
                                        const { response, action } = getBotResponse('comprar');
                                        addBotMessage(response, action);
                                    }, 800);
                                }}
                            >
                                🚗 Comprar
                            </button>
                            <button
                                className="quick-btn"
                                onClick={() => {
                                    addUserMessage('Quiero vender mi auto');
                                    setTimeout(() => {
                                        const { response, action } = getBotResponse('vender');
                                        addBotMessage(response, action);
                                    }, 800);
                                }}
                            >
                                💰 Vender
                            </button>
                        </div>
                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                            />
                            <button className="btn-send" onClick={handleSendMessage}>
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
