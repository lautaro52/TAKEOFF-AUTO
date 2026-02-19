import React from 'react';
import './PromiseFilmstrip.css';

const tryImport = (num) => {
    try {
        return new URL(`../assets/promesas/promesa${num}.jpg`, import.meta.url).href;
    } catch (e) {
        return null;
    }
};

const promiseSlides = [
    { id: 1, title: "Inspección", copy: "Revisión exhaustiva en cada unidad", img: tryImport(1) || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=600" },
    { id: 2, title: "0km Posible", copy: "Tu 0km empieza con un \"SÍ\"", img: tryImport(2) || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=600" },
    { id: 3, title: "Garantía Real", copy: "3 meses de garantía en motor y caja", img: tryImport(3) || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=600" },
    { id: 4, title: "Transparencia", copy: "Financiación del 100% sin vueltas", img: tryImport(4) || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=600" },
    { id: 5, title: "Test Drive", copy: "Probá tu auto antes de decidir", img: tryImport(5) || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=600" },
    { id: 6, title: "Soporte", copy: "Soporte humano de lunes a viernes", img: tryImport(6) || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=600" },
    { id: 7, title: "Tu Futuro", copy: "Nos enfocamos en tu futuro", img: tryImport(7) || "https://images.unsplash.com/photo-1563906267088-26f633d39691?auto=format&fit=crop&q=80&w=600" }
];

const PromiseFilmstrip = () => {
    // Duplicate slides for seamless loop
    const duplicatedSlides = [...promiseSlides, ...promiseSlides, ...promiseSlides];

    return (
        <section className="promise-filmstrip-section">
            <div className="container">
                <h2 className="section-title">Nuestra promesa TakeOff</h2>
            </div>
            <div className="filmstrip-container">
                <div className="filmstrip-track-promise">
                    {duplicatedSlides.map((slide, idx) => (
                        <div key={`${slide.id}-${idx}`} className="filmstrip-slide-promise">
                            <img src={slide.img} alt={slide.title} />
                            <div className="slide-overlay-promise">
                                <h3>{slide.title}</h3>
                                <p>{slide.copy}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PromiseFilmstrip;
