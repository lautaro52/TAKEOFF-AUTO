import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './ZeroKmShowcase.css';

const CarouselSection = ({ title, cars, brandLogo }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [carsPerView, setCarsPerView] = useState(3);

    React.useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setCarsPerView(1);
            } else if (window.innerWidth <= 1024) {
                setCarsPerView(2);
            } else {
                setCarsPerView(3);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const maxIndex = Math.max(0, cars.length - carsPerView);

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
    };

    return (
        <div className="carousel-section">
            {brandLogo && <div className="brand-logo-corner">{brandLogo}</div>}

            <div className="carousel-header">
                <h3 className="carousel-title">{title}</h3>
            </div>

            <div className="carousel-wrapper">
                <button
                    className="carousel-arrow carousel-arrow-left"
                    onClick={prevSlide}
                    aria-label="Previous"
                >
                    <ChevronLeft size={32} />
                </button>

                <div className="carousel-container">
                    <div
                        className="carousel-track"
                        style={{
                            transform: `translateX(-${currentIndex * (100 / carsPerView)}%)`,
                            transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)'
                        }}
                    >
                        {cars.map((car, index) => (
                            <div
                                key={index}
                                className="carousel-card"
                                style={{ minWidth: `${100 / carsPerView}%` }}
                            >
                                <div className="carousel-image-wrapper">
                                    <img src={car.image} alt={car.name} className="carousel-image" />
                                </div>
                                <div className="carousel-name">{car.name}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="carousel-arrow carousel-arrow-right"
                    onClick={nextSlide}
                    aria-label="Next"
                >
                    <ChevronRight size={32} />
                </button>
            </div>
        </div>
    );
};

const ZeroKmShowcase = () => {
    const fiatCars = [
        { name: 'FIAT 600', image: '/images/0km/fiat-600.jpg' },
        { name: 'TITANO', image: '/images/0km/fiat-titano.jpg' },
        { name: 'TORO', image: '/images/0km/fiat-toro.jpg' },
        { name: 'STRADA', image: '/images/0km/fiat-strada.jpg' },
        { name: 'MOBI', image: '/images/0km/fiat-mobi.jpg' },
        { name: 'ARGO', image: '/images/0km/fiat-argo.jpg' },
        { name: 'CRONOS', image: '/images/0km/fiat-cronos.jpg' },
        { name: 'PULSE', image: '/images/0km/fiat-pulse.jpg' },
        { name: 'PULSE ABARTH', image: '/images/0km/fiat-pulse-abarth.jpg' },
        { name: 'PULSE ABARTH STRANGER THINGS', image: '/images/0km/fiat-pulse-abarth-stranger-things.jpg' },
        { name: 'FASTBACK', image: '/images/0km/fiat-fastback.jpg' },
        { name: 'FASTBACK ABARTH', image: '/images/0km/fiat-fastback-abarth.jpg' },
        { name: 'FIORINO', image: '/images/0km/fiat-fiorino.jpg' }
    ];

    const jeepCars = [
        { name: 'JEEP COMMANDER', image: '/images/0km/jeep-commander.jpg' },
        { name: 'JEEP COMPASS', image: '/images/0km/jeep-compass.jpg' },
        { name: 'JEEP GLADIATOR', image: '/images/0km/jeep-gladiator.jpg' },
        { name: 'JEEP GRAND CHEROKEE', image: '/images/0km/jeep-grand-cherokee.jpg' },
        { name: 'JEEP RENEGADE', image: '/images/0km/jeep-renegade.jpg' },
        { name: 'JEEP WRANGLER', image: '/images/0km/jeep-wrangler.jpg' }
    ];

    const ramCars = [
        { name: 'RAM DAKOTA', image: '/images/0km/ram-dakota.jpg' },
        { name: 'RAM RAMPAGE', image: '/images/0km/ram-rampage.jpg' },
        { name: 'RAM 2500', image: '/images/0km/ram-2500.jpg' },
        { name: 'RAM 1500', image: '/images/0km/ram-1500.jpg' }
    ];

    const kiaCars = [
        { name: 'ALL-NEW K3 SEDÁN', image: '/images/0km/kia-k3-sedan.jpg' },
        { name: 'ALL-NEW K3 CROSS', image: '/images/0km/kia-k3-cross.jpg' },
        { name: 'SELTOS', image: '/images/0km/kia-seltos.jpg' },
        { name: 'SPORTAGE', image: '/images/0km/kia-sportage.jpg' },
        { name: 'CARNIVAL', image: '/images/0km/kia-carnival.jpg' },
        { name: 'K2500', image: '/images/0km/kia-k2500.jpg' }
    ];

    return (
        <div className="zerokm-showcase">
            <CarouselSection
                title="ELEGÍ TU VEHÍCULO FIAT 0KM"
                cars={fiatCars}
                brandLogo={<span className="brand-text">FIAT</span>}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO JEEP 0KM"
                cars={jeepCars}
                brandLogo={<span className="brand-text">Jeep</span>}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO RAM 0KM"
                cars={ramCars}
                brandLogo={<span className="brand-text">RAM</span>}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO KIA 0KM"
                cars={kiaCars}
                brandLogo={<span className="brand-text">KIA</span>}
            />
        </div>
    );
};

export default ZeroKmShowcase;
