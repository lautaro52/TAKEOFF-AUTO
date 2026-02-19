import React from 'react';
import { Facebook, Instagram, Twitter, Youtube, Linkedin } from 'lucide-react';
import Logo from './Logo';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="container">
                <div className="footer-top">
                    <div className="footer-logo">
                        <Logo variant="dark" />
                    </div>
                    <div className="social-links">
                        <Facebook size={20} />
                        <Instagram size={20} />
                        <Twitter size={20} />
                        <Youtube size={20} />
                        <Linkedin size={20} />
                    </div>
                </div>

                <div className="footer-grid">
                    <div className="footer-col">
                        <h4>Compra un auto</h4>
                        <ul>
                            <li><a href="#">Catálogo</a></li>
                            <li><a href="#">Cómo comprar</a></li>
                            <li><a href="#">Financiamiento</a></li>
                            <li><a href="#">Garantía</a></li>
                        </ul>
                    </div>
                    {/* <div className="footer-col">
                        <h4>Vende tu auto</h4>
                        <ul>
                            <li><a href="#">Cotizar auto</a></li>
                            <li><a href="#">Cómo vender</a></li>
                            <li><a href="#">Sedes</a></li>
                        </ul>
                    </div> */}
                    <div className="footer-col">
                        <h4>Nosotros</h4>
                        <ul>
                            <li><a href="/nosotros">Conócenos</a></li>
                            <li><a href="#">Trabaja con nosotros</a></li>
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Sustentabilidad</a></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h4>Soporte</h4>
                        <ul>
                            <li><a href="#">Centro de ayuda</a></li>
                            <li><a href="#">Contacto</a></li>
                            <li><a href="#">Preguntas frecuentes</a></li>
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
