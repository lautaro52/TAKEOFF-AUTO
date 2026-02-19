import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, ChevronDown, MapPin, Heart, Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
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

    const handleLogout = async () => {
        await logout();
        navigate('/');
        closeMobileMenu();
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
                    <li><Link to="/credito">Usado o 0km</Link></li>
                    <li><Link to="/catalogo">Compra un auto</Link></li>
                    {isAuthenticated && (
                        <li><Link to="/crm/dashboard">CRM</Link></li>
                    )}
                    <li><Link to="/nosotros">Nosotros</Link></li>
                </ul>

                {/* Desktop Actions */}
                <div className="navbar-actions">
                    <div className="country-flag">🇦🇷</div>
                    <button className="nav-location-btn">
                        <MapPin size={16} />
                        <span>Ubicación</span>
                    </button>
                    {/* <button className="nav-icon-btn">
                        <Heart size={22} />
                    </button> */}

                    {isAuthenticated ? (
                        <div className="auth-actions" style={{ display: 'flex', gap: '0.5rem' }}>
                            <Link to="/crm/dashboard" className="btn-ingresar" style={{ backgroundColor: '#2563eb', color: 'white', border: 'none' }}>
                                <LayoutDashboard size={18} />
                                <span style={{ marginLeft: '8px' }}>Dashboard</span>
                            </Link>
                            <button onClick={handleLogout} className="nav-icon-btn" title="Cerrar Sessión">
                                <LogOut size={20} />
                            </button>
                        </div>
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
                            <li><Link to="/credito" onClick={closeMobileMenu}>Usado o 0km</Link></li>
                            <li><Link to="/catalogo" onClick={closeMobileMenu}>Compra un auto</Link></li>
                            {isAuthenticated && (
                                <li><Link to="/crm/dashboard" onClick={closeMobileMenu}>CRM Dashboard</Link></li>
                            )}
                            <li><Link to="/nosotros" onClick={closeMobileMenu}>Nosotros</Link></li>
                            <li className="mobile-divider"></li>
                            <li>
                                <button className="mobile-location-btn">
                                    <MapPin size={16} />
                                    <span>Ubicación</span>
                                </button>
                            </li>
                            <li>
                                {isAuthenticated ? (
                                    <button onClick={handleLogout} className="mobile-login-btn">
                                        <LogOut size={18} />
                                        <span>Cerrar Sesión</span>
                                    </button>
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
