import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { User, ChevronDown, MapPin, Heart, Menu, X } from 'lucide-react';
import Logo from './Logo';
import './Navbar.css';

const Navbar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const scrollTimeout = useRef(null);

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
                    <li><Link to="/credito">Obtén un crédito</Link></li>
                    <li><Link to="/catalogo">Compra un auto</Link></li>
                    {/* <li><Link to="/vender">Vende tu auto</Link></li>
                    <li><a href="#">Cuida tu auto</a></li> */}
                    <li className="menu-dropdown">
                        <a href="#nosotros">
                            Nosotros
                            <ChevronDown size={16} className="chevron-icon" />
                        </a>
                    </li>
                </ul>

                {/* Desktop Actions */}
                <div className="navbar-actions">
                    <div className="country-flag">🇦🇷</div>
                    <button className="nav-location-btn">
                        <MapPin size={16} />
                        <span>Ubicación</span>
                    </button>
                    <button className="nav-icon-btn">
                        <Heart size={22} />
                    </button>
                    <Link to="/login" className="btn-ingresar">
                        <User size={18} />
                        <span>Ingresar</span>
                    </Link>
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
                            <li><Link to="/credito" onClick={closeMobileMenu}>Obtén un crédito</Link></li>
                            <li><Link to="/catalogo" onClick={closeMobileMenu}>Compra un auto</Link></li>
                            {/* <li><Link to="/vender" onClick={closeMobileMenu}>Vende tu auto</Link></li>
                            <li><a href="#" onClick={closeMobileMenu}>Cuida tu auto</a></li> */}
                            <li><a href="#nosotros" onClick={closeMobileMenu}>Nosotros</a></li>
                            <li className="mobile-divider"></li>
                            <li>
                                <button className="mobile-location-btn">
                                    <MapPin size={16} />
                                    <span>Ubicación</span>
                                </button>
                            </li>
                            <li>
                                <Link to="/login" onClick={closeMobileMenu} className="mobile-login-btn">
                                    <User size={18} />
                                    <span>Ingresar</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                </>
            )}
        </nav>
    );
};

export default Navbar;
