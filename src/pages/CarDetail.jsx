import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
    ChevronRight, ChevronLeft, ChevronDown, Share2, Heart,
    Fuel, Settings2, Calendar, Gauge, Users, DoorClosed,
    Check, MapPin, Shield, Clock, RotateCcw, Search
} from 'lucide-react';
import { getCarById, getCars } from '../services/carsService';
import { API_CONFIG } from '../config';
import { userService } from '../services/userService';
import FinancingModal from '../components/FinancingModal';
import QuoteModal from '../components/QuoteModal';
import './CarDetail.css';

const CarDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [allCars, setAllCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);
    const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);
    const [filteredCars, setFilteredCars] = useState([]);
    const searchRef = useRef(null);
    const thumbnailRef = useRef(null);

    // Fetch Car Data
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [carData, carsData] = await Promise.all([
                    getCarById(id),
                    getCars()
                ]);
                setCar(carData);
                setAllCars(carsData);

                // Check if favorite
                const user = userService.getCurrentUser();
                if (user) {
                    const activities = await userService.getActivities();
                    if (activities.success) {
                        const isFav = activities.favorites.some(f => f.id === parseInt(id));
                        setIsFavorite(isFav);
                    }
                }
            } catch (error) {
                console.error('Error loading car:', error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [id]);

    useEffect(() => {
        // Record view if logged in
        userService.recordQuote(id); // Using recordQuote as activity tracker
    }, [id]);

    // Auto-scroll thumbnails
    useEffect(() => {
        if (thumbnailRef.current && car?.images) {
            const activeThumb = thumbnailRef.current.children[activeImage];
            if (activeThumb) {
                const containerWidth = thumbnailRef.current.offsetWidth;
                const thumbOffset = activeThumb.offsetLeft;
                const thumbWidth = activeThumb.offsetWidth;
                thumbnailRef.current.scrollTo({
                    left: thumbOffset - (containerWidth / 2) + (thumbWidth / 2),
                    behavior: 'smooth'
                });
            }
        }
    }, [activeImage, car]);

    // Live Search logic
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredCars([]);
            return;
        }
        const filtered = allCars.filter(c =>
            `${c.brand} ${c.model} ${c.version || ''}`.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5); // Limit to top 5 results
        setFilteredCars(filtered);
    }, [searchQuery, allCars]);

    // Close search results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSearchResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}?t=${Date.now()}`;
    };

    const handleToggleFavorite = async () => {
        const user = userService.getCurrentUser();
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            const res = await userService.toggleFavorite(car.id, isFavorite);
            if (res.success) {
                setIsFavorite(!isFavorite);
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    const handleSimulationClick = () => {
        setIsFinancingModalOpen(true);
        userService.recordQuote(car.id);
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `${car.brand} ${car.model}`,
                text: `Mirá este ${car.brand} ${car.model} en TAKEOFF AUTO`,
                url: window.location.href,
            }).catch(err => console.error('Error sharing:', err));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href)
                .then(() => alert('Enlace copiado al portapapeles'))
                .catch(err => console.error('Error copying link:', err));
        }
    };

    if (loading) return <div className="loading-state">Cargando...</div>;
    if (!car) return <div className="error-state">Auto no encontrado. <Link to="/catalogo">Volver</Link></div>;

    const images = car.images && car.images.length > 0 ? car.images : [''];

    // Get similar cars (same brand, different id)
    const similarCars = allCars
        .filter(c => c.brand === car.brand && c.id !== car.id)
        .slice(0, 4);

    // Get recommended cars for sidebar
    const sidebarCars = similarCars.slice(0, 2);

    // Car features (placeholder - will be populated from DB later)
    // List of features to check against DB boolean fields
    const featureMapping = [
        { label: 'Aire acondicionado', field: 'air_conditioning' },
        { label: 'Frenos ABS', field: 'abs_brakes' },
        { label: 'Airbags', field: 'airbags', isBoolean: false },
        { label: 'Computadora de abordo', field: 'onboard_computer' },
        { label: 'Control de crucero', field: 'cruise_control' },
        { label: 'Bluetooth', field: 'bluetooth' },
        { label: 'Radio AM/FM', field: 'am_fm_radio' },
        { label: 'Reproductor MP3', field: 'mp3_player' },
        { label: 'Porta vasos', field: 'cup_holders' }
    ];

    const carFeatures = featureMapping
        .filter(f => {
            const val = car[f.field];
            if (f.isBoolean === false) return val && val !== '0' && val !== 'No';
            return val === 1 || val === true || val === '1';
        })
        .map(f => f.label);

    const getVal = (val, suffix = '') => {
        if (val === null || val === undefined || val === '' || val === 0 || val === '0') return '-';
        return `${val}${suffix}`;
    };

    return (
        <div className="takeoff-car-detail">
            <div className="takeoff-container no-padding-top">
                <div className="takeoff-search-bar-container" ref={searchRef}>
                    <div className="takeoff-search-input-wrapper">
                        <Search className="takeoff-search-icon" size={18} />
                        <input
                            type="text"
                            placeholder="Busca tu próximo auto..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setShowSearchResults(true);
                            }}
                            onFocus={() => setShowSearchResults(true)}
                        />
                    </div>
                    {showSearchResults && filteredCars.length > 0 && (
                        <div className="takeoff-search-results">
                            {filteredCars.map(res => (
                                <Link
                                    key={res.id}
                                    to={`/car/${res.id}`}
                                    className="takeoff-search-item"
                                    onClick={() => {
                                        setShowSearchResults(false);
                                        setSearchQuery('');
                                    }}
                                >
                                    <div className="takeoff-search-item-thumb">
                                        <img src={getImageUrl(res.images?.[0])} alt={res.model} />
                                    </div>
                                    <div className="takeoff-search-item-info">
                                        <div className="takeoff-search-item-name">{res.brand} {res.model}</div>
                                        <div className="takeoff-search-item-meta">
                                            {res.year} • {Number(res.km).toLocaleString('es-AR')} km • ${Number(res.price).toLocaleString('es-AR')}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="takeoff-search-arrow" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="takeoff-detail-grid">
                    {/* 1. GALLERY (Part of the grid to align with right column on desktop) */}
                    <div className="takeoff-gallery-top">
                        <div className="takeoff-gallery">
                            <div className="takeoff-gallery-main-v2">
                                <img
                                    src={getImageUrl(images[activeImage])}
                                    alt={`${car.brand} ${car.model}`}
                                    className="takeoff-main-image"
                                />
                                {images.length > 1 && (
                                    <>
                                        <button
                                            className="takeoff-gallery-nav prev"
                                            onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button
                                            className="takeoff-gallery-nav next"
                                            onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="takeoff-gallery-thumbnails" ref={thumbnailRef}>
                                    {images.map((img, index) => (
                                        <div
                                            key={index}
                                            className={`takeoff-thumbnail ${activeImage === index ? 'active' : ''}`}
                                            onClick={() => setActiveImage(index)}
                                        >
                                            <img src={getImageUrl(img)} alt={`Vista ${index + 1}`} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 1b. Descripción General (Relocated from left column) */}
                        <section className="takeoff-section-gallery">
                            <h2 className="takeoff-section-title-small">Descripción general</h2>
                            <div className="takeoff-specs-main-grid-v2">
                                <div className="takeoff-spec-item">
                                    <Gauge className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{getVal(Number(car.km).toLocaleString('es-AR'), ' km')}</div>
                                        <div className="takeoff-spec-label">Kilometraje</div>
                                    </div>
                                </div>
                                <div className="takeoff-spec-item">
                                    <Settings2 className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{car.transmission === 'automatico' ? 'Automática' : (car.transmission === 'manual' ? 'Manual' : '-')}</div>
                                        <div className="takeoff-spec-label">Transmisión</div>
                                    </div>
                                </div>
                                <div className="takeoff-spec-item">
                                    <Fuel className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{getVal(car.fuel)}</div>
                                        <div className="takeoff-spec-label">Combustible</div>
                                    </div>
                                </div>
                                <div className="takeoff-spec-item">
                                    <Settings2 className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{getVal(car.engine_size, ' L')}</div>
                                        <div className="takeoff-spec-label">Motor</div>
                                    </div>
                                </div>
                                <div className="takeoff-spec-item">
                                    <Users className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{getVal(car.passengers)}</div>
                                        <div className="takeoff-spec-label">Pasajeros</div>
                                    </div>
                                </div>
                                <div className="takeoff-spec-item">
                                    <DoorClosed className="takeoff-spec-icon" />
                                    <div className="takeoff-spec-info">
                                        <div className="takeoff-spec-value">{getVal(car.doors)}</div>
                                        <div className="takeoff-spec-label">Puertas</div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 1c. Características (Relocated below Descripción General) */}
                        <section className="takeoff-section-gallery">
                            <h2 className="takeoff-section-title-small">Características del {car.brand} {car.model}</h2>
                            <div className="takeoff-features-checklist">
                                {carFeatures.map((feature, index) => (
                                    <div key={index} className="takeoff-feature-check">
                                        <Check size={18} className="takeoff-check-blue" />
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* 2. RIGHT COLUMN (Price, CTA, Credits) */}
                    <div className="takeoff-right-column">
                        <div className="takeoff-sticky-wrapper">
                            {/* Car Header Info */}
                            <div className="takeoff-header-right">
                                <div className="takeoff-header-info">
                                    <h1 className="takeoff-model-large">
                                        {car.brand} {car.model} {car.version} {car.year}
                                    </h1>
                                    <div className="takeoff-meta-small">
                                        <div className="takeoff-meta-line">{Number(car.km).toLocaleString('es-AR')} km • {car.city}</div>
                                        <div className="takeoff-delivery-estimate">
                                            <Clock size={14} /> Entrega inmediata
                                        </div>
                                    </div>
                                </div>
                                <div className="takeoff-header-actions">
                                    <button className="takeoff-action-btn" onClick={handleShare}><Share2 size={20} /></button>
                                    <button
                                        className={`takeoff-action-btn ${isFavorite ? 'favorite' : ''}`}
                                        onClick={handleToggleFavorite}
                                    >
                                        <Heart size={20} fill={isFavorite ? '#E74C3C' : 'none'} color={isFavorite ? '#E74C3C' : 'currentColor'} />
                                    </button>
                                </div>
                            </div>

                            {/* Price Boxes Section */}
                            <div className="takeoff-price-section">
                                <div className="takeoff-price-box regular">
                                    <div className="takeoff-price-box-label">Precio regular</div>
                                    <div className="takeoff-price-box-amount">
                                        ${Number(car.price).toLocaleString('es-AR')}
                                        <button className="takeoff-info-icon-btn"><Check size={14} /></button>
                                    </div>
                                </div>

                                <div className="takeoff-price-box credit">
                                    <div className="takeoff-price-box-label">Llevatelo hoy por tan solo:</div>
                                    <div className="takeoff-price-box-amount">
                                        ${(Number(car.price) * 0.20).toLocaleString('es-AR')}
                                        <button className="takeoff-info-icon-btn"><Check size={14} /></button>
                                    </div>
                                    <div className="takeoff-credit-installment-row promo-highlight">
                                        <span className="takeoff-installment-text">100% FINANCIADO SOLO POR {
                                            ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
                                                "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"][new Date().getMonth()]
                                        }</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trade-in Box */}
                            <div className="takeoff-tradein-box">
                                <div className="takeoff-tradein-header">
                                    <div className="takeoff-tradein-title">Aceptamos autos en forma de pago, llave por llave</div>
                                    <button className="takeoff-quote-btn" onClick={() => setIsQuoteModalOpen(true)}>
                                        <Check size={14} /> Mandanos tu auto
                                    </button>
                                </div>
                                <p className="takeoff-tradein-desc">
                                    Cotiza para conocer el valor de tu auto y úsalo como parte de pago.
                                </p>
                            </div>

                            {/* Main CTA Button */}
                            <button
                                className="takeoff-main-cta blue-btn"
                                onClick={handleSimulationClick}
                            >
                                Calcular cuota
                            </button>

                            {/* Right Column Specs List */}
                            <div className="takeoff-specs-list">
                                <div className="takeoff-spec-list-item">
                                    <div className="takeoff-spec-list-left">
                                        <span className="takeoff-spec-list-label">Año</span>
                                        <span className="takeoff-spec-list-value">{car.year}</span>
                                    </div>
                                </div>
                                <div className="takeoff-spec-list-item">
                                    <div className="takeoff-spec-list-left">
                                        <span className="takeoff-spec-list-label">Versión</span>
                                        <span className="takeoff-spec-list-value">{car.version || car.model?.toUpperCase()}</span>
                                    </div>
                                </div>
                                <div className="takeoff-spec-list-item">
                                    <div className="takeoff-spec-list-left">
                                        <span className="takeoff-spec-list-label">Transmisión</span>
                                        <span className="takeoff-spec-list-value">{car.transmission === 'automatico' ? 'Automático' : 'Manual'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Guarantees Banner */}
                <section className="takeoff-guarantees-banner">
                    <div className="takeoff-guarantee-item">
                        <Shield size={32} />
                        <div className="takeoff-guarantee-content">
                            <strong>Inspección Total Certificada</strong>
                            <p>Cada vehículo pasa por una revisión técnica exhaustiva antes de la entrega.</p>
                        </div>
                    </div>
                    <div className="takeoff-guarantee-item">
                        <RotateCcw size={32} />
                        <div className="takeoff-guarantee-content">
                            <strong>Garantía Mecánica</strong>
                            <p>Cobertura de 3 meses en motor y caja de cambios para tu tranquilidad.</p>
                        </div>
                    </div>
                    <div className="takeoff-guarantee-item">
                        <Clock size={32} />
                        <div className="takeoff-guarantee-content">
                            <strong>Test Drive y Soporte</strong>
                            <p>Prueba el auto antes de comprarlo y cuenta con atención de lunes a viernes.</p>
                        </div>
                    </div>
                </section>

                {/* Financing Promotion */}
                <section className="takeoff-financing-promo">
                    <div className="takeoff-promo-content">
                        <h3>¿Necesitas un financiamiento?</h3>
                        <p>Obtén las mejores tasas del mercado con nuestros bancos aliados</p>
                        <button className="takeoff-promo-btn" onClick={() => setIsFinancingModalOpen(true)}>
                            SIMULAR CRÉDITO
                        </button>
                    </div>
                </section>

                {/* Similar Vehicles Grid */}
                {similarCars.length > 0 && (
                    <section className="takeoff-similar-section">
                        <h2 className="takeoff-similar-title">Vehículos similares</h2>
                        <div className="takeoff-similar-grid">
                            {similarCars.map((similarCar, index) => (
                                <Link
                                    key={similarCar.id}
                                    to={`/car/${similarCar.id}`}
                                    className="takeoff-similar-card"
                                >
                                    <img
                                        src={getImageUrl(similarCar.images?.[0])}
                                        alt={`${similarCar.brand} ${similarCar.model}`}
                                        className="takeoff-similar-img"
                                    />
                                    <div className="takeoff-similar-info">
                                        <h3 className="takeoff-similar-name">
                                            {similarCar.brand} {similarCar.model}
                                        </h3>
                                        <p className="takeoff-similar-specs">
                                            {similarCar.year} • {Number(similarCar.km).toLocaleString('es-AR')} km
                                        </p>
                                        <p className="takeoff-similar-location">
                                            <MapPin size={14} /> {similarCar.city || 'Córdoba Capital'}
                                        </p>
                                        <div className="takeoff-similar-price">
                                            ${Number(similarCar.price).toLocaleString('es-AR')}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <FinancingModal
                isOpen={isFinancingModalOpen}
                onClose={() => setIsFinancingModalOpen(false)}
                car={car}
            />
            <QuoteModal
                isOpen={isQuoteModalOpen}
                onClose={() => setIsQuoteModalOpen(false)}
            />
        </div>
    );
};

export default CarDetail;
