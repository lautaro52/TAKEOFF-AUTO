import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PriceInquiryModal from './PriceInquiryModal';
import ProductCard from './ProductCard';
import './ZeroKmShowcase.css';

const CarouselSection = ({ title, cars, brandLogo, onCarClick }) => {
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
                                className="carousel-product-wrapper"
                                style={{ minWidth: `${100 / carsPerView}%`, padding: '0 10px' }}
                            >
                                <ProductCard
                                    car={car}
                                    onClick={!car.id ? () => onCarClick(car) : undefined}
                                />
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

const ZeroKmShowcase = ({ catalogCars = [] }) => {
    const [selectedCar, setSelectedCar] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCarClick = (car) => {
        // If it's a real catalog car object
        if (car.id) {
            setSelectedCar(car);
        } else {
            // Fallback for hardcoded cars
            setSelectedCar({
                brand: car.name.split(' ')[0],
                model: car.name.split(' ').slice(1).join(' '),
                year: 2024,
                home_section: '0km'
            });
        }
        setIsModalOpen(true);
    };

    // Helper to format catalog cars for the carousel
    const formatCatalogCar = (car) => {
        let image = car.images && car.images.length > 0 ? car.images[0] : '/placeholder.jpg';
        // If the path doesn't start with http or images/, it might need the base URL
        if (image && !image.startsWith('http') && !image.startsWith('images/') && !image.startsWith('/')) {
            image = `${API_CONFIG.IMAGE_BASE_URL}${image}`;
        }

        return {
            ...car,
            name: `${car.brand} ${car.model}`,
            image: image
        };
    };

    // Filter real catalog cars by brand
    const getCarsByBrand = (brandName, hardcodedList) => {
        const fromCatalog = catalogCars
            .filter(c => c.brand && c.brand.toUpperCase() === brandName.toUpperCase());

        // Use catalog data if available, otherwise fallback to hardcoded list
        return fromCatalog.length > 0 ? fromCatalog : hardcodedList;
    };

    const fiatHardcoded = [
        { brand: 'FIAT', model: '600', images: ['images/0km/fiat-600.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'TITANO', images: ['images/0km/fiat-titano.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'TORO', images: ['images/0km/fiat-toro.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'STRADA', images: ['images/0km/fiat-strada.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'MOBI', images: ['images/0km/fiat-mobi.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'ARGO', images: ['images/0km/fiat-argo.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'CRONOS', images: ['images/0km/fiat-cronos.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'PULSE', images: ['images/0km/fiat-pulse.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'PULSE ABARTH', images: ['images/0km/fiat-pulse-abarth.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'PULSE ABARTH STRANGER THINGS', images: ['images/0km/fiat-pulse-abarth-stranger-things.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'FASTBACK', images: ['images/0km/fiat-fastback.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'FASTBACK ABARTH', images: ['images/0km/fiat-fastback-abarth.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'FIAT', model: 'FIORINO', images: ['images/0km/fiat-fiorino.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' }
    ];

    const jeepHardcoded = [
        { brand: 'JEEP', model: 'COMMANDER', images: ['images/0km/jeep-commander.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'JEEP', model: 'COMPASS', images: ['images/0km/jeep-compass.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'JEEP', model: 'GLADIATOR', images: ['images/0km/jeep-gladiator.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'JEEP', model: 'GRAND CHEROKEE', images: ['images/0km/jeep-grand-cherokee.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'JEEP', model: 'RENEGADE', images: ['images/0km/jeep-renegade.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'JEEP', model: 'WRANGLER', images: ['images/0km/jeep-wrangler.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' }
    ];

    const ramHardcoded = [
        { brand: 'RAM', model: 'DAKOTA', images: ['images/0km/ram-dakota.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'RAM', model: 'RAMPAGE', images: ['images/0km/ram-rampage.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'RAM', model: '2500', images: ['images/0km/ram-2500.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'RAM', model: '1500', images: ['images/0km/ram-1500.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' }
    ];

    const kiaHardcoded = [
        { brand: 'KIA', model: 'ALL-NEW K3 SEDÁN', images: ['images/0km/kia-k3-sedan.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'KIA', model: 'ALL-NEW K3 CROSS', images: ['images/0km/kia-k3-cross.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'KIA', model: 'SELTOS', images: ['images/0km/kia-seltos.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'KIA', model: 'SPORTAGE', images: ['images/0km/kia-sportage.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'KIA', model: 'CARNIVAL', images: ['images/0km/kia-carnival.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' },
        { brand: 'KIA', model: 'K2500', images: ['images/0km/kia-k2500.jpg'], year: 2024, km: 0, status: 'disponible', home_section: '0km' }
    ];

    const fiatCars = getCarsByBrand('FIAT', fiatHardcoded);
    const jeepCars = getCarsByBrand('JEEP', jeepHardcoded);
    const ramCars = getCarsByBrand('RAM', ramHardcoded);
    const kiaCars = getCarsByBrand('KIA', kiaHardcoded);

    return (
        <div className="zerokm-showcase">
            <CarouselSection
                title="ELEGÍ TU VEHÍCULO FIAT 0KM"
                cars={fiatCars}
                brandLogo={<span className="brand-text">FIAT</span>}
                onCarClick={handleCarClick}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO JEEP 0KM"
                cars={jeepCars}
                brandLogo={<span className="brand-text">Jeep</span>}
                onCarClick={handleCarClick}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO RAM 0KM"
                cars={ramCars}
                brandLogo={<span className="brand-text">RAM</span>}
                onCarClick={handleCarClick}
            />

            <CarouselSection
                title="ELEGÍ TU VEHÍCULO KIA 0KM"
                cars={kiaCars}
                brandLogo={<span className="brand-text">KIA</span>}
                onCarClick={handleCarClick}
            />

            {isModalOpen && (
                <PriceInquiryModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    car={selectedCar}
                />
            )}
        </div>
    );
};

export default ZeroKmShowcase;
