import React, { useState } from 'react';
import './HowItWorks.css';
import QuoteModal from './QuoteModal';

const HowItWorks = () => {
    const [activeTab, setActiveTab] = useState('compra');
    const [showQuoteModal, setShowQuoteModal] = useState(false);

    const stepsCompra = [
        {
            num: 1,
            title: "Cotizá tu Auto",
            text: "Completá el formulario con fotos y datos técnicos."
        },
        {
            num: 2,
            title: "Elegí tu Nuevo Auto",
            text: "Seleccioná un usado o 0km y calculá tu cuota."
        },
        {
            num: 3,
            title: "Salí Manejando",
            text: "Coordinamos el peritaje físico de tu auto y te llevás el nuevo en el acto."
        }
    ];

    const stepsVende = [
        {
            num: 1,
            title: "Ingresa los datos",
            text: "Proporciona los detalles de tu auto y recibe una cotización al instante"
        },
        {
            num: 2,
            title: "Elige una oferta",
            text: "Conoce nuestras opciones y elige la que mejor se adapta a ti"
        },
        {
            num: 3,
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
        <section className="how-it-works">
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
                            {/* <button
                                className={`how-tab ${activeTab === 'vende' ? 'active' : ''}`}
                                onClick={() => setActiveTab('vende')}
                            >
                                Vende
                            </button> */}
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
                        {steps.map((step) => (
                            <div key={step.num} className="how-step-card">
                                <div className="step-number">{step.num}</div>
                                <h3>{step.title}</h3>
                                <p>{step.text}</p>
                            </div>
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
