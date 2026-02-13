import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import './Hero.css';
import heroVideo from '../assets/hero-video.mp4';
import heroPoster from '../assets/hero-poster.jpg';

const Hero = () => {
    const [searchValue, setSearchValue] = useState('');


    return (
        <section className="hero">
            <video
                className="hero-video"
                autoPlay
                loop
                muted
                playsInline
                poster={heroPoster}
            >
                <source src={heroVideo} type="video/mp4" />
            </video>
            <div className="hero-overlay"></div>
            <div className="container">
                <div className="hero-content">
                    <h1>Transforma tu camino</h1>
                    <p className="hero-subtitle">Compra y venta de autos. Financiamiento a tu medida</p>

                    <div className="hero-search-area">
                        <div className="search-bar-rounded">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Busca por marca"
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                            />
                        </div>

                        <div className="hero-pill-actions">
                            <Link to="/catalogo" className="pill-action-btn">Compra</Link>
                            <Link to="/credito" className="pill-action-btn">Cambia</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
