import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin } from 'lucide-react';
import { userService } from '../services/userService';
import { API_CONFIG } from '../config';
import './ProductCard.css';

const ProductCard = ({ car }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    // Check if favorited
    useEffect(() => {
        const checkFavorite = async () => {
            const user = userService.getCurrentUser();
            if (!user) return;
            try {
                const activities = await userService.getActivities();
                if (activities.success && activities.favorites) {
                    const favorited = activities.favorites.some(f => f.id === car.id);
                    setIsFavorite(favorited);
                }
            } catch (error) {
                console.error('Error checking favorite:', error);
            }
        };
        checkFavorite();
    }, [car.id]);

    const handleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();

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

    const handleCardClick = async () => {
        try {
            const { trackCarView } = await import('../services/analyticsService');
            trackCarView(car.id, { brand: car.brand, model: car.model, type: car.type });
        } catch (error) {
            console.debug('Analytics tracking skipped:', error);
        }
    };

    const hasPhotos = car.images && car.images.length > 0;
    const displayImage = hasPhotos
        ? (car.images[0].startsWith('http')
            ? car.images[0]
            : (car.images[0].startsWith('images/')
                ? `/${car.images[0]}`
                : `${API_CONFIG.IMAGE_BASE_URL}${car.images[0]}`))
        : 'https://via.placeholder.com/600x400?text=Imagen+no+disponible';

    const cleanText = (text) => {
        if (!text) return '';
        return text.toString()
            .replace(/\*\*/g, '') // Remove Markdown bold
            .replace(/#/g, '')    // Remove Markdown headers
            .replace(/Ã-/g, 'í')  // Fix common encoding issues
            .replace(/Ã¡/g, 'á')
            .replace(/Ã©/g, 'é')
            .replace(/Ã³/g, 'ó')
            .replace(/Ãº/g, 'ú')
            .replace(/Ã±/g, 'ñ')
            .replace(/\s+/g, ' ')
            .trim();
    };

    const descriptionSnippet = useMemo(() => {
        const text = cleanText(car.description || car.specs);
        if (!text) return null;
        return text.length > 100 ? `${text.slice(0, 97)}…` : text;
    }, [car.description, car.specs]);

    return (
        <Link to={`/car/${car.id}`} className="car-card-refined-link" onClick={handleCardClick}>
            <div className="car-location-top-badge">
                <MapPin size={16} />
                <span>{car.city || 'Córdoba Capital'}</span>
            </div>

            <div className="car-image-wrapper">
                <img
                    src={displayImage}
                    alt={`${car.brand} ${car.model}`}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=Imagen+no+disponible' }}
                />
                {!hasPhotos && (
                    <div className="no-photo-badge">Sin fotos disponibles</div>
                )}
                <button
                    className={`favorite-btn-overlay ${isFavorite ? 'active' : ''}`}
                    onClick={handleFavorite}
                >
                    <Heart
                        size={20}
                        fill={isFavorite ? '#ff4d4f' : 'none'}
                        color={isFavorite ? '#ff4d4f' : '#666'}
                    />
                </button>
            </div>

            <div className="car-card-body">
                <h3 className="car-card-title">{car.brand} - {car.model}</h3>
                <p className="car-card-specs-main">{car.year} • {Number(car.km).toLocaleString('es-AR')} km</p>


                {typeof car.stock === 'number' && (
                    <div className={`car-card-stock ${car.stock > 0 ? 'available' : 'unavailable'}`}>
                        {car.stock > 0 ? `Stock disponible: ${car.stock}` : 'Sin unidades disponibles'}
                    </div>
                )}

                {descriptionSnippet && (
                    <p className="car-card-description-snippet">{descriptionSnippet}</p>
                )}

                <div className="car-card-pricing">
                    {Number(car.price) > 0 ? (
                        <>
                            <p className="car-price-label-premium">Entrega inmediata con el 20%</p>
                            <p className="car-card-price-value">
                                ${(Number(car.price) * 0.2).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                {car.isUSD && <span className="usd-label"> USD</span>}
                            </p>
                            <p className="car-card-total-ref">
                                Precio total: ${Number(car.price).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                                {car.isUSD ? ' USD' : ''}
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="car-price-label-premium">{car.home_section === '0km' ? 'Vehículo 0km' : 'Precio a consultar'}</p>
                            <p className="car-card-price-value consultar-precio-text">Consultar Precio</p>
                        </>
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
