import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    const whatsappLink = "https://wa.me/5493516752879?text=Hola,%20tengo%20una%20consulta";

    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <Logo variant="dark" />
                    </div>
                    <div className="social-links">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><Facebook size={20} /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><Instagram size={20} /></a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer"><Youtube size={20} /></a>
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Catalogo de usados</h4>
                        <ul>
                            <li><a href="/catalogo">Catalogo de usados</a></li>
                            <li><a href="/catalogo">Catálogo</a></li>
                            <li><a href="/credito">Cómo comprar</a></li>
                            <li><a href="/credito#calculadora">Financiamiento</a></li>
                            <li><a href="/credito#promesas">Garantía</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Nosotros</h4>
                        <ul>
                            <li><a href="/nosotros">Nosotros</a></li>
                            <li><a href="/nosotros">Conócenos</a></li>
                            <li><a href="/partner/dashboard">Trabaja con nosotros</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Soporte</h4>
                        <ul>
                            <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Soporte</a></li>
                            <li><a href={whatsappLink} target="_blank" rel="noopener noreferrer">Contacto</a></li>
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
