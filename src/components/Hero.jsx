import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronRight } from 'lucide-react';
import './Hero.css';
import { getCars } from '../services/carsService';
import { API_CONFIG } from '../config';
import heroVideo from '../assets/hero-video.mp4';
import heroPoster from '../assets/hero-poster.jpg';

const Hero = () => {
    const [searchValue, setSearchValue] = useState('');
    const [allCars, setAllCars] = useState([]);
    const [filteredCars, setFilteredCars] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const searchRef = React.useRef(null);

    // Fetch cars for search
    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                setAllCars(data);
            } catch (err) {
                console.error("Error fetching cars for hero search:", err);
            }
        };
        fetchCars();
    }, []);

    // Filter logic
    useEffect(() => {
        if (!searchValue.trim()) {
            setFilteredCars([]);
            return;
        }
        const filtered = allCars.filter(c =>
            `${c.brand} ${c.model} ${c.version || ''}`.toLowerCase().includes(searchValue.toLowerCase())
        ).slice(0, 5);
        setFilteredCars(filtered);
    }, [searchValue, allCars]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowResults(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const getImageUrl = (imagePath) => {
        if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_CONFIG.IMAGE_BASE_URL}${imagePath}`;
    };


    return (
        <section className="hero">
            <div className="hero-bg-wrapper">
                <video
                    className="hero-video"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="auto"
                    poster={heroPoster}
                    onLoadedData={(e) => e.target.play()}
                >
                    <source src={heroVideo} type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
            </div>
            <div className="container">
                <div className="hero-content">
                    <h1>Tu próximo auto empieza aquí.</h1>
                    <p className="hero-subtitle">Transparencia absoluta en usados y 0km.</p>

                    <div className="hero-search-area" ref={searchRef}>
                        <div className="search-bar-rounded">
                            <Search className="search-icon" size={20} />
                            <input
                                type="text"
                                placeholder="Busca por marca o modelo"
                                value={searchValue}
                                onChange={(e) => {
                                    setSearchValue(e.target.value);
                                    setShowResults(true);
                                }}
                                onFocus={() => setShowResults(true)}
                            />
                        </div>

                        {showResults && filteredCars.length > 0 && (
                            <div className="hero-search-results">
                                {filteredCars.map(car => (
                                    <Link
                                        key={car.id}
                                        to={`/car/${car.id}`}
                                        className="hero-search-item"
                                        onClick={() => setShowResults(false)}
                                    >
                                        <div className="hero-search-item-thumb">
                                            <img src={getImageUrl(car.images?.[0])} alt={car.model} />
                                        </div>
                                        <div className="hero-search-item-info">
                                            <div className="hero-search-item-name">{car.brand} {car.model}</div>
                                            <div className="hero-search-item-meta">
                                                {car.year} • {Number(car.km).toLocaleString('es-AR')} km • ${Number(car.price).toLocaleString('es-AR')}
                                            </div>
                                        </div>
                                        <ChevronRight size={16} className="hero-search-arrow" />
                                    </Link>
                                ))}
                            </div>
                        )}

                        <div className="hero-pill-actions">
                            <Link to="/catalogo" className="pill-action-btn">Compra</Link>
                            <Link to="/#renova" className="pill-action-btn">Cambia</Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
