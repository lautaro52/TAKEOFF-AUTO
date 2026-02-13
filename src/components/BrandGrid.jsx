import React from 'react';
import { Link } from 'react-router-dom';
import './BrandGrid.css';

// Import local images from assets (Naming convention: cat-NAME.png)
import sed from '../assets/cat-sedan.png';
import suv from '../assets/cat-suv.png';
import cou from '../assets/cat-coupe.png';
import conv from '../assets/cat-convertible.png';
import pick from '../assets/cat-pickup.png';
import hatch from '../assets/cat-hatchback.png';
import mini from '../assets/cat-minivan.png';

const BrandGrid = () => {
    const types = [
        { name: "Sedán", id: "sedan", img: sed },
        { name: "SUV", id: "suv", img: suv },
        { name: "Coupe", id: "coupe", img: cou },
        { name: "Convertible", id: "convertible", img: conv },
        { name: "Pickup", id: "pickup", img: pick },
        { name: "Hatchback", id: "hatchback", img: hatch },
        { name: "Minivan", id: "minivan", img: mini }
    ];

    return (
        <section className="brand-grid-section">
            <div className="container">
                <h2 className="section-title-types">Explora por tipo de auto</h2>
                <div className="types-grid-single-line">
                    {types.map((type) => (
                        <Link to={`/catalogo?type=${type.id}`} key={type.id} className="type-item">
                            <div className="type-card">
                                <div className="type-image-box">
                                    <img src={type.img} alt={type.name} />
                                </div>
                                <span className="type-label">{type.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default BrandGrid;
