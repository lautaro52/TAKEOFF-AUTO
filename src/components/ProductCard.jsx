import { Link } from 'react-router-dom';
import './ProductCard.css';

const ProductCard = ({ id, image, title, price, monthly, brand, model, type }) => {
    // Fallback image if none provided
    const displayImage = image || 'https://via.placeholder.com/400x300?text=No+Image';

    // Track car view when card is clicked
    const handleCardClick = async () => {
        try {
            const { trackCarView } = await import('../services/analyticsService');
            trackCarView(id, { brand, model, type });
        } catch (error) {
            // Silently fail - analytics should not break navigation
            console.debug('Analytics tracking skipped:', error);
        }
    };

    return (
        <Link to={`/car/${id}`} className="product-card-link" onClick={handleCardClick}>
            <div className="product-card-refined">
                <div className="product-image-container">
                    <img
                        src={displayImage}
                        alt={title}
                        className="car-image"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                    />
                </div>
                <div className="product-details">
                    <h4 className="car-name">{title}</h4>
                    <p className="car-price">{price}</p>
                    <p className="monthly-payment">Desde {monthly} (sujeto a aprobacion crediticia)*</p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
