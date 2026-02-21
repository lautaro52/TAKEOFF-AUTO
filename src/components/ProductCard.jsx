import React, { useState, useEffect } from 'react';
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

    const displayImage = car.images?.[0]?.startsWith('http')
        ? car.images[0]
        : `${API_CONFIG.IMAGE_BASE_URL}${car.images?.[0]}`;

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
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/600x400?text=No+Image' }}
                />
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
                <p className="car-card-specs-details">{car.specs}</p>

                <div className="car-card-pricing">
                    <p className="car-price-label-premium">Entrega inmediata con el 20%</p>
                    <p className="car-card-price-value">
                        ${(Number(car.price) * 0.2).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        {car.isUSD && <span className="usd-label"> USD</span>}
                    </p>
                    <p className="car-card-total-ref">
                        Precio total: ${Number(car.price).toLocaleString('es-AR', { maximumFractionDigits: 0 })}
                        {car.isUSD ? ' USD' : ''}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
