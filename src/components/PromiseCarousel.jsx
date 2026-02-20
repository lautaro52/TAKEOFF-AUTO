import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './PromiseCarousel.css';

// Import images (assuming user will put them in src/assets/promesas/)
const tryImport = (num) => {
    try {
        return new URL(`../assets/promesas/promesa${num}.jpg`, import.meta.url).href;
    } catch (e) {
        return null;
    }
};

const slides = [
    {
        id: 1,
        title: "El Rigor de la Inspección",
        copy: "Revisión exhaustiva en cada unidad.",
        image: tryImport(1) || "https://images.unsplash.com/photo-1486006920555-c77dcf18193c?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "Tu Próximo 0km es Posible",
        copy: "Tu 0km empieza con un \"SÍ\".",
        image: tryImport(2) || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Garantía Mecánica Real",
        copy: "3 meses de garantía en motor y caja.",
        image: tryImport(3) || "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 4,
        title: "Transparencia Financiera",
        copy: "Financiación del 100% sin vueltas.",
        image: tryImport(4) || "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 5,
        title: "La Experiencia del Test Drive",
        copy: "Probá tu auto antes de decidir.",
        image: tryImport(5) || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 6,
        title: "Soporte Personalizado",
        copy: "Soporte humano de lunes a viernes.",
        image: tryImport(6) || "https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 7,
        title: "Entrega Sin Mirar el Pasado",
        copy: "Nos enfocamos en tu futuro, no en tu pasado.",
        image: tryImport(7) || "https://images.unsplash.com/photo-1563906267088-26f633d39691?auto=format&fit=crop&q=80&w=800"
    }
];

const PromiseCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, []);

    const prevSlide = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, []);

    useEffect(() => {
        const timer = setInterval(nextSlide, 4000);
        return () => clearInterval(timer);
    }, [nextSlide]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <div className="promise-carousel">
            <div className="carousel-track-promise" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                {slides.map((slide) => (
                    <div key={slide.id} className="carousel-slide-promise">
                        <img src={slide.image} alt={slide.title} />
                        <div className="slide-content-promise">
                            <h3>{slide.title}</h3>
                            <p>{slide.copy}</p>
                        </div>
                    </div>
                ))}
            </div>

            <button className="carousel-arrow-promise prev" onClick={prevSlide} aria-label="Anterior">
                <ChevronLeft size={24} />
            </button>
            <button className="carousel-arrow-promise next" onClick={nextSlide} aria-label="Siguiente">
                <ChevronRight size={24} />
            </button>

            <div className="carousel-dots-promise">
                {slides.map((_, idx) => (
                    <button
                        key={idx}
                        className={`dot-promise ${idx === currentIndex ? 'active' : ''}`}
                        onClick={() => goToSlide(idx)}
                    />
                ))}
            </div>
        </div>
    );
};

export default PromiseCarousel;
