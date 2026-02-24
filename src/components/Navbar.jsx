import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, MapPin, Heart, Menu, X, LogOut } from 'lucide-react';
import { userService } from '../services/userService';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [user, setUser] = useState(null);
    const [showLocation, setShowLocation] = useState(false);
    const scrollTimeout = useRef(null);
    const locationRef = useRef(null);

    useEffect(() => {
        const currentUser = userService.getCurrentUser();
        setUser(currentUser);
    }, []);

    // Listen for custom event to open location modal
    useEffect(() => {
        const handleOpen = () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setShowLocation(true);
        };
        window.addEventListener('open-location', handleOpen);
        return () => window.removeEventListener('open-location', handleOpen);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            // Hide navbar on scroll
            setIsVisible(false);

            // Clear previous timeout
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }

            // Show navbar after 250ms of no scrolling
            scrollTimeout.current = setTimeout(() => {
                setIsVisible(true);
            }, 250);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (scrollTimeout.current) {
                clearTimeout(scrollTimeout.current);
            }
        };
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocation(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <nav className={`navbar ${!isVisible ? 'navbar-hidden' : ''}`}>
            <div className="navbar-container">
                <div className="navbar-logo">
                    <a href="/">
                        <Logo />
                    </a>
                </div>

                {/* Desktop Menu */}
                <ul className="navbar-menu">
                    <li><Link to="/">Inicio</Link></li>
                    <li><Link to="/credito">Usado o 0km</Link></li>
                    <li><Link to="/catalogo">Catalogo de usados</Link></li>
                    {/* <li><Link to="/vender">Vende tu auto</Link></li>
                    <li><a href="#">Cuida tu auto</a></li> */}
                    <li><Link to="/nosotros">Nosotros</Link></li>
                </ul>

                {/* Desktop Actions */}
                <div className="navbar-actions">
                    <div className="country-flag">🇦🇷</div>
                    <div className="nav-location-container" ref={locationRef}>
                        <button
                            className={`nav-location-btn ${showLocation ? 'active' : ''}`}
                            onClick={() => setShowLocation(!showLocation)}
                        >
                            <MapPin size={16} />
                            <span>Ubicación</span>
                        </button>

                        {showLocation && (
                            <div className="location-popup">
                                <div className="location-popup-content">
                                    <div className="location-popup-header">
                                        <MapPin size={18} className="location-icon-blue" />
                                        <h4>Nuestra Ubicación</h4>
                                    </div>
                                    <p className="location-address">Av. Fuerza Aérea Argentina 3808</p>
                                    <p className="location-city">Córdoba, Argentina</p>
                                    <a
                                        href="https://www.google.com/maps/search/?api=1&query=Turin+Usados+Av.+Fuerza+Aérea+Argentina+3808+Córdoba"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-view-map"
                                    >
                                        Ver en Google Maps
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <button className="nav-icon-btn" onClick={() => user ? window.location.href = '/panel' : window.location.href = '/login'}>
                        <Heart size={22} />
                    </button>
                    {user ? (
                        <Link to="/panel" className="btn-ingresar logged-in">
                            <div className="nav-user-avatar">
                                {user.email[0].toUpperCase()}
                            </div>
                            <span>Mi Panel</span>
                        </Link>
                    ) : (
                        <Link to="/login" className="btn-ingresar">
                            <User size={18} />
                            <span>Ingresar</span>
                        </Link>
                    )}
                </div>

                {/* Mobile Hamburger Button */}
                <button
                    className="mobile-menu-btn"
                    onClick={toggleMobileMenu}
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <>
                    <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>
                    <div className="mobile-menu">
                        <ul className="mobile-menu-list">
                            <li><Link to="/" onClick={closeMobileMenu}>Inicio</Link></li>
                            <li><Link to="/credito" onClick={closeMobileMenu}>Usado o 0km</Link></li>
                            <li><Link to="/catalogo" onClick={closeMobileMenu}>Catalogo de usados</Link></li>
                            {/* <li><Link to="/vender" onClick={closeMobileMenu}>Vende tu auto</Link></li>
                            <li><a href="#" onClick={closeMobileMenu}>Cuida tu auto</a></li> */}
                            <li><Link to="/nosotros" onClick={closeMobileMenu}>Nosotros</Link></li>
                            <li className="mobile-divider"></li>
                            <li>
                                <button
                                    className={`mobile-location-btn ${showLocation ? 'active' : ''}`}
                                    onClick={() => setShowLocation(!showLocation)}
                                >
                                    <div className="mobile-location-btn-content">
                                        <MapPin size={18} />
                                        <span>Ubicación</span>
                                    </div>
                                    <ChevronDown
                                        size={16}
                                        style={{
                                            transform: showLocation ? 'rotate(180deg)' : 'rotate(0deg)',
                                            transition: 'transform 0.3s ease',
                                            marginLeft: 'auto'
                                        }}
                                    />
                                </button>
                                {showLocation && (
                                    <div className="mobile-location-details">
                                        <p className="mobile-location-address">Av. Fuerza Aérea Argentina 3808</p>
                                        <p className="mobile-location-city">Córdoba, Argentina</p>
                                        <a
                                            href="https://www.google.com/maps/search/?api=1&query=Turin+Usados+Av.+Fuerza+Aérea+Argentina+3808+Córdoba"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="mobile-btn-map"
                                        >
                                            Ver en Google Maps
                                        </a>
                                    </div>
                                )}
                            </li>
                            <li>
                                {user ? (
                                    <Link to="/panel" onClick={closeMobileMenu} className="mobile-login-btn logged-in">
                                        <div className="nav-user-avatar">
                                            {user.email[0].toUpperCase()}
                                        </div>
                                        <span>Mi Panel</span>
                                    </Link>
                                ) : (
                                    <Link to="/login" onClick={closeMobileMenu} className="mobile-login-btn">
                                        <User size={18} />
                                        <span>Ingresar</span>
                                    </Link>
                                )}
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
