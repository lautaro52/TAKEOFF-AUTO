import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ChevronRight,
    Share2,
    Heart,
    ShieldCheck,
    RotateCcw,
    Clock,
    MapPin,
    Calendar,
    Gauge,
    Fuel,
    Settings2,
    ChevronDown,
    ChevronUp,
    Info
} from 'lucide-react';
import { getCarById } from '../services/carsService';
import { API_CONFIG } from '../config';
import FinancingModal from '../components/FinancingModal';
import './CarDetail.css';

const CarDetail = () => {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeImage, setActiveImage] = useState(0);
    const [activeAccordion, setActiveAccordion] = useState('General');
    const [isFinancingModalOpen, setIsFinancingModalOpen] = useState(false);
    const thumbnailRef = React.useRef(null);

    //Load car data from API
    useEffect(() => {
        const loadCar = async () => {
            try {
                setLoading(true);
                const carData = await getCarById(id);
                setCar(carData);
            } catch (error) {
                console.error('Error loading car:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCar();
    }, [id]);

    // Auto-scroll thumbnails
    useEffect(() => {
        if (thumbnailRef.current) {
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
    }, [activeImage]);

    const toggleAccordion = (section) => {
        setActiveAccordion(activeAccordion === section ? null : section);
    };

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}?t=${Date.now()}`;
    };

    if (loading) {
        return (
            <div className="car-detail-page">
                <div className="container">
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                        <p>Cargando auto...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!car) {
        return (
            <div className="car-detail-page">
                <div className="container">
                    <div style={{ padding: '60px 0', textAlign: 'center' }}>
                        <h2>Auto no encontrado</h2>
                        <Link to="/catalogo" className="btn-primary" style={{ marginTop: '20px' }}>
                            Volver al catálogo
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const images = car.images && car.images.length > 0 ? car.images : [''];

    return (
        <div className="car-detail-page">
            <div className="container">
                {/* Breadcrumbs */}
                <nav className="breadcrumbs">
                    <Link to="/">Inventario</Link> <ChevronRight size={14} />
                    <Link to="/catalogo">{car.brand}</Link> <ChevronRight size={14} />
                    <span>{car.brand} {car.model}</span>
                </nav>

                <div className="detail-layout">
                    {/* Main Content */}
                    <div className="detail-main">
                        <div className="gallery-section">
                            <div className="main-image-container">
                                {car.status === 'apartado' && (
                                    <span className="badge-reacondicionado" style={{ background: '#f59e0b' }}>
                                        <Clock size={14} /> Apartado
                                    </span>
                                )}
                                {car.featured && (
                                    <span className="badge-reacondicionado">
                                        <ShieldCheck size={14} /> Destacado
                                    </span>
                                )}
                                <img
                                    src={getImageUrl(images[activeImage])}
                                    alt={`${car.brand} ${car.model}`}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=No+Image' }}
                                />
                                {images.length > 1 && (
                                    <div className="gallery-controls">
                                        <button
                                            className="btn-gallery-nav prev"
                                            onClick={() => setActiveImage(prev => prev > 0 ? prev - 1 : images.length - 1)}
                                        >
                                            <ChevronRight style={{ transform: 'rotate(180deg)' }} />
                                        </button>
                                        <button
                                            className="btn-gallery-nav next"
                                            onClick={() => setActiveImage(prev => prev < images.length - 1 ? prev + 1 : 0)}
                                        >
                                            <ChevronRight />
                                        </button>
                                    </div>
                                )}
                            </div>
                            {images.length > 1 && (
                                <div className="thumbnail-slider-container">
                                    <div className="thumbnail-slider" ref={thumbnailRef}>
                                        {images.map((img, i) => (
                                            <div
                                                key={i}
                                                className={`thumb ${i === activeImage ? 'active' : ''}`}
                                                onClick={() => setActiveImage(i)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <img
                                                    src={getImageUrl(img)}
                                                    alt=""
                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image' }}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="gallery-indicator-bar-container">
                                        <div className="gallery-indicator-bar">
                                            <div
                                                className="indicator-active"
                                                style={{
                                                    width: `${100 / images.length}%`,
                                                    left: `${(100 / images.length) * activeImage}%`
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="guarantees-banner">
                            <p>
                                <strong>¿Qué certificamos en este auto?</strong> <br />
                                Todos nuestros autos pasan por una inspección de 240 puntos, cuentan con <strong>7 días o 300 km de prueba</strong> y garantía mecánica por 3 meses.
                            </p>
                        </div>

                        <section className="detail-section">
                            <h2 className="section-title-alt">Descripción general</h2>
                            <div className="quick-specs-grid">
                                <div className="spec-item">
                                    <Calendar size={20} />
                                    <div>
                                        <span className="spec-label">Año</span>
                                        <span className="spec-value">{car.year}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <Gauge size={20} />
                                    <div>
                                        <span className="spec-label">Kilometraje</span>
                                        <span className="spec-value">{car.km ? `${Number(car.km).toLocaleString('es-AR')} km` : 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <Settings2 size={20} />
                                    <div>
                                        <span className="spec-label">Transmisión</span>
                                        <span className="spec-value">{car.transmission === 'automatico' ? 'Automático' : 'Manual'}</span>
                                    </div>
                                </div>
                                <div className="spec-item">
                                    <Fuel size={20} />
                                    <div>
                                        <span className="spec-label">Combustible</span>
                                        <span className="spec-value">{car.fuel?.charAt(0).toUpperCase() + car.fuel?.slice(1)}</span>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* DETAILED SPECIFICATIONS SECTION */}
                        <section className="detail-section">
                            <h2 className="section-title-alt">📋 Características Técnicas Completas</h2>

                            {/* General specs accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'General' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('General')}
                                >
                                    <h3>Información General</h3>
                                    {activeAccordion === 'General' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'General' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            <div className="spec-row">
                                                <span className="spec-label">Marca:</span>
                                                <span className="spec-value">{car.brand || 'N/A'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Modelo:</span>
                                                <span className="spec-value">{car.model || 'N/A'}</span>
                                            </div>
                                            {car.version && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Versión:</span>
                                                    <span className="spec-value">{car.version}</span>
                                                </div>
                                            )}
                                            <div className="spec-row">
                                                <span className="spec-label">Año:</span>
                                                <span className="spec-value">{car.year}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Color:</span>
                                                <span className="spec-value">{car.color || 'N/A'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Tipo de combustible:</span>
                                                <span className="spec-value">{car.fuel?.charAt(0).toUpperCase() + car.fuel?.slice(1) || 'N/A'}</span>
                                            </div>
                                            {car.doors && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Puertas:</span>
                                                    <span className="spec-value">{car.doors}</span>
                                                </div>
                                            )}
                                            <div className="spec-row">
                                                <span className="spec-label">Transmisión:</span>
                                                <span className="spec-value">{car.transmission === 'automatico' ? 'Automático' : 'Manual'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Tipo de carrocería:</span>
                                                <span className="spec-value">{car.type?.charAt(0).toUpperCase() + car.type?.slice(1) || 'N/A'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Kilómetros:</span>
                                                <span className="spec-value">{car.km ? `${Number(car.km).toLocaleString('es-AR')} km` : 'N/A'}</span>
                                            </div>
                                            {car.passengers && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Capacidad de personas:</span>
                                                    <span className="spec-value">{car.passengers}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Motor accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'Motor' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('Motor')}
                                >
                                    <h3>Motor y Rendimiento</h3>
                                    {activeAccordion === 'Motor' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'Motor' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            {car.engine_size && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Motor:</span>
                                                    <span className="spec-value">{car.engine_size}</span>
                                                </div>
                                            )}
                                            {car.horsepower && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Potencia:</span>
                                                    <span className="spec-value">{car.horsepower}</span>
                                                </div>
                                            )}
                                            {car.valves_per_cylinder && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Válvulas por cilindro:</span>
                                                    <span className="spec-value">{car.valves_per_cylinder}</span>
                                                </div>
                                            )}
                                            {car.fuel_tank_liters && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Capacidad del tanque:</span>
                                                    <span className="spec-value">{car.fuel_tank_liters} L</span>
                                                </div>
                                            )}
                                            {car.traction_control && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Control de tracción:</span>
                                                    <span className="spec-value">{car.traction_control}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Dimensions accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'Dimensiones' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('Dimensiones')}
                                >
                                    <h3>Dimensiones</h3>
                                    {activeAccordion === 'Dimensiones' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'Dimensiones' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            {(car.length_mm && car.width_mm && car.height_mm) && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Largo x Altura x Ancho:</span>
                                                    <span className="spec-value">{car.length_mm} mm x {car.height_mm} mm x {car.width_mm} mm</span>
                                                </div>
                                            )}
                                            {car.wheelbase_mm && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Distancia entre ejes:</span>
                                                    <span className="spec-value">{car.wheelbase_mm} mm</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Safety accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'Seguridad' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('Seguridad')}
                                >
                                    <h3>Seguridad</h3>
                                    {activeAccordion === 'Seguridad' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'Seguridad' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            <div className="spec-row">
                                                <span className="spec-label">Frenos ABS:</span>
                                                <span className="spec-value">{car.abs_brakes ? 'Sí' : 'No'}</span>
                                            </div>
                                            {car.airbags && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Airbags:</span>
                                                    <span className="spec-value">{car.airbags}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Comfort accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'Confort' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('Confort')}
                                >
                                    <h3>Confort y Características</h3>
                                    {activeAccordion === 'Confort' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'Confort' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            <div className="spec-row">
                                                <span className="spec-label">Piloto automático:</span>
                                                <span className="spec-value">{car.cruise_control ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Aire acondicionado:</span>
                                                <span className="spec-value">{car.air_conditioning ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Computadora de abordo:</span>
                                                <span className="spec-value">{car.onboard_computer ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Porta vasos:</span>
                                                <span className="spec-value">{car.cup_holders ? 'Sí' : 'No'}</span>
                                            </div>
                                            {car.steering_type && (
                                                <div className="spec-row">
                                                    <span className="spec-label">Dirección:</span>
                                                    <span className="spec-value">{car.steering_type}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Entertainment accordion */}
                            <div className="spec-accordion">
                                <div
                                    className={`accordion-header ${activeAccordion === 'Entretenimiento' ? 'active' : ''}`}
                                    onClick={() => toggleAccordion('Entretenimiento')}
                                >
                                    <h3>Entretenimiento</h3>
                                    {activeAccordion === 'Entretenimiento' ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                </div>
                                {activeAccordion === 'Entretenimiento' && (
                                    <div className="accordion-content">
                                        <div className="specs-grid">
                                            <div className="spec-row">
                                                <span className="spec-label">AM/FM:</span>
                                                <span className="spec-value">{car.am_fm_radio ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Bluetooth:</span>
                                                <span className="spec-value">{car.bluetooth ? 'Sí' : 'No'}</span>
                                            </div>
                                            <div className="spec-row">
                                                <span className="spec-label">Reproductor de MP3:</span>
                                                <span className="spec-value">{car.mp3_player ? 'Sí' : 'No'}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* Sidebar */}
                    <aside className="detail-sidebar">
                        <div className="reserve-card">
                            <div className="status-label">
                                <span className="dot"></span>
                                {car.status === 'disponible' && 'Disponible'}
                                {car.status === 'apartado' && 'Apartado'}
                                {car.status === 'vendido' && 'Vendido'}
                            </div>
                            <div className="car-header-info">
                                <h1>{car.brand} {car.model} {car.year}</h1>
                                <div className="version-info">{car.specs} • {car.km ? `${Number(car.km).toLocaleString('es-AR')} km` : '0 km'} • Córdoba Capital</div>
                                <div className="actions">
                                    <button><Heart size={20} /></button>
                                    <button><Share2 size={20} /></button>
                                </div>
                            </div>

                            <div className="pricing-info">
                                <div className="price-row main">
                                    <span className="price-label">Precio de contado</span>
                                    <span className="price-value">
                                        ${Number(car.price).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                        {Number(car.price) < 100000 && <span className="usd-label"> USD</span>}
                                    </span>
                                    <Info size={14} className="info-icon" />
                                </div>
                                <div className="financing-box">
                                    <div className="price-row">
                                        <span className="price-label">Enganche desde (20%):</span>
                                        <span className="price-value">
                                            ${(Number(car.price) * 0.2).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                            {Number(car.price) < 100000 ? ' USD' : ''}
                                        </span>
                                        <Info size={14} className="info-icon" />
                                    </div>
                                    <div className="financing-details">
                                        Saldo financiado en hasta 72 meses <button className="btn-link" onClick={() => setIsFinancingModalOpen(true)}>Consultar</button>
                                    </div>
                                </div>

                                {car.city && (
                                    <div className="location-info">
                                        <MapPin size={18} />
                                        <span>Se encuentra en Córdoba Capital</span>
                                    </div>
                                )}

                                <div className="delivery-info">
                                    <RotateCcw size={18} />
                                    <span>Garantía de 3 meses de caja y motor</span>
                                </div>
                            </div>

                            <button
                                className="btn-reserve"
                                disabled={car.status !== 'disponible'}
                                onClick={() => setIsFinancingModalOpen(true)}
                            >
                                {car.status === 'disponible' && 'Elegi Tu Cuota'}
                                {car.status === 'apartado' && 'Auto Apartado'}
                                {car.status === 'vendido' && 'Auto Vendido'}
                            </button>

                            <div className="dynamic-financing-promo" style={{
                                marginTop: '16px',
                                textAlign: 'center',
                                color: '#0066FF',
                                fontWeight: '600',
                                fontSize: '0.9rem'
                            }}>
                                {`Solo por ${new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date()).charAt(0).toUpperCase() + new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date()).slice(1)} Financia hasta el 100%`}
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            <div className="bottom-cta-banner">
                <div className="container">
                    <div className="cta-content">
                        <h3>Paga tu auto a plazos de hasta 72 meses</h3>
                        <p>Con tasas competitivas y aprobación en minutos.</p>
                        <button className="btn-primary-alt">Analiza tu préstamo</button>
                    </div>
                    <div className="cta-image">
                        <div className="mock-image"></div>
                    </div>
                </div>
            </div>

            <FinancingModal
                isOpen={isFinancingModalOpen}
                onClose={() => setIsFinancingModalOpen(false)}
                car={car}
            />
        </div>
    );
};

export default CarDetail;
