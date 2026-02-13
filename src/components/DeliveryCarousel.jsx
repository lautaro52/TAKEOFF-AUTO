import React, { useState, useEffect } from 'react';
import './DeliveryCarousel.css';

// Import delivery images
import entrega1 from '../assets/entregas/entrega1.jpg';
import entrega2 from '../assets/entregas/entrega2.jpg';
import entrega3 from '../assets/entregas/entrega3.jpg';
import entrega4 from '../assets/entregas/entrega4.jpg';
import entrega5 from '../assets/entregas/entrega5.jpg';
import entrega6 from '../assets/entregas/entrega6.jpg';
import entrega7 from '../assets/entregas/entrega7.jpg';
import entrega8 from '../assets/entregas/entrega8.jpg';

const DeliveryCarousel = () => {
    const images = [entrega1, entrega2, entrega3, entrega4, entrega5, entrega6, entrega7, entrega8];

    // Duplicate images for seamless infinite scroll
    const duplicatedImages = [...images, ...images, ...images];

    return (
        <div className="delivery-carousel-filmstrip">
            <div className="filmstrip-track">
                {duplicatedImages.map((img, idx) => (
                    <div key={idx} className="filmstrip-slide">
                        <img src={img} alt={`Entrega ${(idx % images.length) + 1}`} draggable="false" />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DeliveryCarousel;

