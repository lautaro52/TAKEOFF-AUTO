import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, Car, CheckCircle } from 'lucide-react';
import './HowItWorks.css';
import QuoteModal from './QuoteModal';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('compra');
    const [showQuoteModal, setShowQuoteModal] = useState(false);
    const [isHighlighted, setIsHighlighted] = useState(false);
    const location = useLocation();

    useEffect(() => {
        if (location.hash === '#renova') {
            const element = document.getElementById('renova');
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                setIsHighlighted(true);
                // Clear highlight after a few seconds
                const timer = setTimeout(() => setIsHighlighted(false), 3000);
                return () => clearTimeout(timer);
            }
        }
    }, [location]);

    const stepsCompra = [
        {
            num: 1,
            Icon: FileText,
            title: "Cotizá tu Auto",
            text: "Completá el formulario con fotos y datos técnicos."
        },
        {
            num: 2,
            Icon: Car,
            title: "Elegí tu Nuevo Auto",
            text: "Seleccioná un usado o 0km y calculá tu cuota."
        },
        {
            num: 3,
            Icon: CheckCircle,
            title: "Salí Manejando",
            text: "Coordinamos el peritaje físico de tu auto y te llevás el nuevo en el acto."
        }
    ];

    const stepsVende = [
        {
            num: 1,
            Icon: FileText,
            title: "Ingresa los datos",
            text: "Proporciona los detalles de tu auto y recibe una cotización al instante"
        },
        {
            num: 2,
            Icon: Car,
            title: "Elige una oferta",
            text: "Conoce nuestras opciones y elige la que mejor se adapta a ti"
        },
        {
            num: 3,
            Icon: CheckCircle,
            title: "Agenda la inspección",
            text: "Programa la hora y el lugar que más te convenga para recibir tu pago"
        }
    ];

    const steps = activeTab === 'compra' ? stepsCompra : stepsVende;
    const title = activeTab === 'compra'
        ? 'Renová tu auto en 3 simples pasos'
        : 'Descubre cuánto vale tu auto y elige el mejor momento para vender';
    const linkText = activeTab === 'compra' ? 'Ver autos que puedo pagar →' : 'Cotizar →';

    return (
        <section id="renova" className={`how-it-works ${isHighlighted ? 'highlight' : ''}`}>
            <div className="container">
                <div className="how-grid-layout">
                    {/* Left Info Column */}
                    <div className="how-info-sidebar">
                        <div className="how-tabs">
                            <button
                                className={`how-tab active`}
                                onClick={() => setShowQuoteModal(true)}
                            >
                                Cotizá tu Auto
                            </button>
                        </div>

                        <div className="how-title-area">
                            <h2>{activeTab === 'compra' ? 'Renová tu auto en 3 simples pasos' : ''}</h2>
                            <a href="/catalogo" className="how-link">
                                Ver autos que puedo pagar →
                            </a>
                        </div>
                    </div>

                    {/* Steps Row (Right side) */}
                    <div className="how-steps-row">
                        <div className="how-step-connector"></div>
                        {steps.map((step, index) => (
                            <motion.div
                                key={step.num}
                                className="how-step-card"
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5, delay: index * 0.2 }}
                            >
                                <div className="how-step-icon-wrapper">
                                    <div className="step-number">{step.num}</div>
                                    <div className="step-icon">
                                        <step.Icon size={24} />
                                    </div>
                                </div>
                                <div className="how-step-content">
                                    <h3>{step.title}</h3>
                                    <p>{step.text}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            <QuoteModal
                isOpen={showQuoteModal}
                onClose={() => setShowQuoteModal(false)}
            />
        </section>
    );
};

export default HowItWorks;
