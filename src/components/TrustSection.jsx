import React from 'react';
import { HandCoins, Compass, Sparkles } from 'lucide-react';
import './TrustSection.css';

const TrustSection = () => {
    const items = [
        {
            icon: <HandCoins size={40} strokeWidth={1} />,
            title: "Financia el auto que quieres",
            text: "Aprobamos 6 de cada 10 créditos"
        },
        {
            icon: <Compass size={40} strokeWidth={1} />,
            title: "Tu Tranquilidad Primero",
            text: "Cobertura total en motor y caja por 90 días."
        },
        {
            icon: <Sparkles size={40} strokeWidth={1} />,
            title: "Stock Multimarca",
            text: "+100 unidades certificadas y validadas."
        }
    ];

    return (
        <section className="trust-section">
            <div className="container">
                <h2 className="trust-main-title">Descubre por qué más de 1.000 clientes ya confiaron en TAKEOFF AUTO</h2>
                <div className="trust-grid-refined">
                    {items.map((item, index) => (
                        <div key={index} className="trust-card-white">
                            <div className="trust-icon-refined">{item.icon}</div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
