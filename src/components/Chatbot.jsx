import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Calendar, Gauge, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG, OPENAI_CONFIG } from '../config';
import './Chatbot.css';

const Chatbot = () => {
    // Claves para localStorage
    const STORAGE_KEY_MESSAGES = 'takeoff_chat_messages';
    const STORAGE_KEY_IS_OPEN = 'takeoff_chat_is_open';
    const STORAGE_KEY_LAST_ACTIVE = 'takeoff_chat_last_active';
    const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutos en ms

    const [isOpen, setIsOpen] = useState(() => {
        const saved = localStorage.getItem(STORAGE_KEY_IS_OPEN);
        return saved === 'true';
    });

    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const navigate = useNavigate();

    const AGENT_URL = `${API_CONFIG.BASE_URL}/chatbot_agent.php`;

    // 1. Cargar mensajes iniciales y verificar tiempo de inactividad
    useEffect(() => {
        const checkSession = () => {
            const lastActive = localStorage.getItem(STORAGE_KEY_LAST_ACTIVE);
            const savedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);

            if (lastActive && savedMessages) {
                const timeDiff = Date.now() - parseInt(lastActive);
                if (timeDiff > INACTIVITY_LIMIT) {
                    // Sesión expirada: Limpiar chat
                    localStorage.removeItem(STORAGE_KEY_MESSAGES);
                    localStorage.removeItem(STORAGE_KEY_IS_OPEN);
                    localStorage.removeItem(STORAGE_KEY_LAST_ACTIVE);
                    setMessages([]);
                } else {
                    // Sesión válida: Cargar mensajes
                    setMessages(JSON.parse(savedMessages));
                }
            }
        };

        checkSession();

        const handleOpen = () => setIsOpen(true);
        window.addEventListener('open-chatbot', handleOpen);
        return () => window.removeEventListener('open-chatbot', handleOpen);
    }, []);

    // 2. Guardar estado y actualizar timestamp de actividad
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
        localStorage.setItem(STORAGE_KEY_IS_OPEN, isOpen);
        if (messages.length > 0) {
            localStorage.setItem(STORAGE_KEY_LAST_ACTIVE, Date.now().toString());
        }
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    const addBotMessage = (text, carData = null) => {
        setMessages(prev => [...prev, {
            text,
            sender: 'bot',
            timestamp: new Date(),
            carData
        }]);
    };

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, {
            text,
            sender: 'user',
            timestamp: new Date()
        }]);
    };

    // Estados para el buffer de mensajes
    const [pendingBatch, setPendingBatch] = useState([]);
    const timerRef = useRef(null);

    const getBotResponse = async (userMessage) => {
        try {
            // Enviamos el mensaje actual o el lote acumulado
            const response = await fetch(AGENT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMessage,
                    history: messages.slice(-10).map(m => ({ text: m.text, sender: m.sender })),
                    openai_api_key: OPENAI_CONFIG.API_KEY
                }),
            });

            const data = await response.json();
            if (data.success) {
                return { text: data.reply, carData: data.car_data };
            }
            return { text: 'Perdón, tuve un problema. ¿Podés repetir?' };
        } catch (error) {
            console.error(error);
            return { text: 'No puedo conectarme ahora mismo.' };
        }
    };

    const processBatch = async (batch) => {
        if (batch.length === 0) return;

        setIsTyping(true);
        // Unimos los mensajes del lote con saltos de línea
        const fullMessage = batch.join('\n');
        const response = await getBotResponse(fullMessage);

        setIsTyping(false);
        addBotMessage(response.text, response.carData);
        setPendingBatch([]); // Limpiar lote procesado
    };

    const handleSendMessage = async () => {
        if (inputValue.trim() === '') return;

        const userMsg = inputValue;
        addUserMessage(userMsg);
        setInputValue('');

        // Limpiar temporizador previo
        if (timerRef.current) clearTimeout(timerRef.current);

        // Agregar al lote actual
        const newBatch = [...pendingBatch, userMsg];
        setPendingBatch(newBatch);

        // Iniciar cuenta regresiva de 5 segundos
        timerRef.current = setTimeout(() => {
            processBatch(newBatch);
        }, 5000);
    };

    const handleQuickButton = async (text) => {
        if (isTyping) return;
        addUserMessage(text);
        setIsTyping(true);
        const response = await getBotResponse(text);
        setIsTyping(false);
        addBotMessage(response.text, response.carData);
    };

    return (
        <div className={`chatbot-container ${isOpen ? 'open' : ''}`}>
            {!isOpen && (
                <button className="chat-toggle" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={30} color="white" />
                </button>
            )}

            {isOpen && (
                <div className="chat-window shadow-xl">
                    <div className="chat-header">
                        <div className="chat-title">
                            <div className="chat-status-dot active"></div>
                            <div className="chat-info">
                                <h4>Daniel</h4>
                                <p>Asistente Comercial • Online</p>
                            </div>
                        </div>
                        <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
                            <X size={20} />
                        </button>
                    </div>

                    <div className="chat-body">
                        {messages.length === 0 && (
                            <div className="chat-welcome-box">
                                <div className="welcome-avatar">D</div>
                                <p>¡Hola! Soy <strong>Daniel</strong>. Estoy aquí para ayudarte a encontrar tu próximo compañero de ruta. ¿Qué tenés en mente hoy?</p>
                            </div>
                        )}

                        {messages.map((message, index) => (
                            <div key={index} className={`message-wrapper ${message.sender}`}>
                                <div className={`message-bubble ${message.sender}`}>
                                    {message.text}
                                </div>

                                {message.carData && Array.isArray(message.carData) && (
                                    <div className="car-recommendations-list">
                                        {message.carData.map((car, carIdx) => (
                                            <div key={carIdx} className="car-card-compact" onClick={() => navigate(car.url)}>
                                                <div className="car-card-img">
                                                    <img src={`${API_CONFIG.IMAGE_BASE_URL}${car.image}`} alt={car.model} />
                                                    <div className="car-card-price">${car.price.toLocaleString('es-AR')}</div>
                                                </div>
                                                <div className="car-card-content">
                                                    <h5>{car.brand} {car.model}</h5>
                                                    <div className="car-card-meta">
                                                        <span><Calendar size={12} /> {car.year}</span>
                                                        <ChevronRight size={14} className="ml-auto" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-bubble bot typing">
                                <span className="dot"></span>
                                <span className="dot"></span>
                                <span className="dot"></span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-footer">
                        {messages.length < 4 && (
                            <div className="chat-suggested">
                                <button onClick={() => handleQuickButton('¿Qué financiaciones tienen?')}>Financiación</button>
                                <button onClick={() => handleQuickButton('Busco un usado familiar')}>Familiar</button>
                                <button onClick={() => handleQuickButton('¿Toman mi auto en parte de pago?')}>Permutas</button>
                            </div>
                        )}
                        <div className="chat-input-row">
                            <input
                                placeholder="Escribí aquí..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            />
                            <button className="send-btn" onClick={handleSendMessage} disabled={isTyping}>
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
