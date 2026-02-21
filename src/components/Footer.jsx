import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import { API_CONFIG } from '../config';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    const whatsappLink = API_CONFIG.WHATSAPP_LINK + "?text=Hola,%20tengo%20una%20consulta";

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <Logo variant="dark" />
                    </div>
                    <div className="social-links">
                        <a href={API_CONFIG.INSTAGRAM_LINK} target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                        <a href={API_CONFIG.YOUTUBE_LINK} target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Catalogo de usados</h4>
                        <ul>
                            <li><a href="/catalogo">Catalogo de usados</a></li>
                            <li><a href="/credito?tab=0km">Catalogo de 0km</a></li>
                            <li><a href="/#purchase-process">Cómo comprar</a></li>
                            <li><a href="/#simulation-section">Financiamiento</a></li>
                            <li><a href="/credito#promesas">Garantía</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Nosotros</h4>
                        <ul>
                            <li><a href="/nosotros">Nosotros</a></li>
                            <li><button onClick={() => window.dispatchEvent(new CustomEvent('open-location'))} className="footer-trigger-btn">Conócenos</button></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Soporte</h4>
                        <ul>
                            <li><button onClick={() => window.dispatchEvent(new CustomEvent('open-chatbot'))} className="footer-trigger-btn">Soporte</button></li>
                            <li><a href={API_CONFIG.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Contacto</a></li>
                        </ul>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 TAKEOFF auto. Todos los derechos reservados.</p>
                    <div className="legal-links">
                        <a href="#">Aviso de privacidad</a>
                        <a href="#">Términos y condiciones</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
