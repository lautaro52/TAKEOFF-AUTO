import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronDown, CheckCircle, Shield, Clock, TrendingUp, PlayCircle, MapPin, MessageCircle, Pencil } from 'lucide-react';
import VideoModal from '../components/VideoModal';
import Reveal from '../components/Reveal';
import { API_CONFIG } from '../config';
import './Sell.css';

// Local Assets
import sellHeroImg from '../assets/sell-hero.jpg';
import sellVendeImg from '../assets/sell-vende.jpg';
import sellCambiaImg from '../assets/sell-cambia.jpg';
import sellDejaImg from '../assets/sell-deja.jpg';
import testimonialVideo1 from '../assets/testimonial-1.mp4';
import testimonialVideo2 from '../assets/testimonial-2.mp4';
import testimonialThumb1 from '../assets/testimonial-thumb-1.jpg';
import testimonialThumb2 from '../assets/testimonial-thumb-2.jpg';

// Loan Carousel Assets
import loanRefinancia from '../assets/loan-refinancia.jpg';
import loanNegocio from '../assets/loan-negocio.jpg';
import loanHogar from '../assets/loan-hogar.jpg';
import loanFamilia from '../assets/loan-familia.jpg';
import loanEmergencia from '../assets/loan-emergencia.jpg';

const Sell = () => {
    const [activeTab, setActiveTab] = useState('vende'); // 'vende', 'cambia', 'deja'
    const [openFaq, setOpenFaq] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedVideo, setSelectedVideo] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleOpenVideo = (videoUrl, title) => {
        setSelectedVideo({ videoUrl, title });
        setIsModalOpen(true);
    };

    const faqs = [
        {
            q: "¿Qué documentos necesito para vender mi auto?",
            a: "Necesitas identificación oficial, tarjeta de circulación, factura original o secuencia de facturas, y comprobantes de tenencias pagadas."
        },
        {
            q: "¿Cómo recibo el pago de mi auto?",
            a: "El pago se realiza mediante transferencia bancaria segura una vez que se haya verificado la documentación y el estado mecánico del vehículo."
        },
        {
            q: "¿Qué pasa si mi auto todavía tiene un crédito vigente?",
            a: "No te preocupes, en TAKEOFF AUTO podemos ayudarte a liquidar tu deuda actual y tomar la diferencia como parte del pago de tu nuevo auto o dártela en efectivo."
        }
    ];

    return (
        <div className="sell-page">
            {/* HERO SECTION WITH VALUATION FORM */}
            <section className="sell-hero">
                <div className="container sell-hero-container">
                    <Reveal direction="left" duration={0.85}>
                        <div className="valuation-card">
                            <h3>Obtén una oferta por tu auto</h3>
                            <p>Al instante y sin salir de casa, es la forma más fácil y rápida.</p>
                            <div className="valuation-form">
                                <div className="form-group">
                                    <label>Placa</label>
                                    <input type="text" placeholder="Ej: ABC-123-D" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Año</label>
                                        <select>
                                            <option>Selecciona</option>
                                            <option>2024</option>
                                            <option>2023</option>
                                            <option>2022</option>
                                            <option>2021</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Modelo</label>
                                        <select>
                                            <option>Selecciona</option>
                                            <option>Civic</option>
                                            <option>Corolla</option>
                                            <option>Jetta</option>
                                        </select>
                                    </div>
                                </div>
                                <button className="btn-primary-k full-width big-blue">COTIZAR</button>
                            </div>
                        </div>
                    </Reveal>
                </div>
                <div className="hero-bg-image">
                    <img src={sellHeroImg} alt="Vender auto" />
                </div>
            </section>

            {/* TAB SELECTOR */}
            <Reveal direction="down" duration={0.7} delay={0.2}>
                <div className="tabs-container-sell">
                    <div className="tabs-switcher-sell">
                        <button className={`tab-btn-s ${activeTab === 'vende' ? 'active' : ''}`} onClick={() => setActiveTab('vende')}>Vender</button>
                        <button className={`tab-btn-s ${activeTab === 'cambia' ? 'active' : ''}`} onClick={() => setActiveTab('cambia')}>Cambiar</button>
                        <button className={`tab-btn-s ${activeTab === 'deja' ? 'active' : ''}`} onClick={() => setActiveTab('deja')}>Obtener préstamo</button>
                    </div>
                </div>
            </Reveal>

            {/* DYNAMIC CONTENT BASED ON TABS */}
            <div className="sell-content-wrapper">
                {activeTab === 'vende' && (
                    <>
                        <section className="section section-staggered">
                            <div className="container">
                                <Reveal direction="up" duration={0.85}>
                                    <h2 className="section-title centered">El proceso más rápido y seguro de vender tu auto</h2>
                                    <p className="section-subtitle centered">Sigue estos pasos y obtén tu dinero hoy mismo.</p>
                                </Reveal>

                                <div className="staggered-visual-section">
                                    <div className="staggered-img-box">
                                        <Reveal direction="left" duration={0.85} delay={0.2}>
                                            <img src={sellVendeImg} alt="Proceso venta" />
                                            <div className="floating-card-s pos-1">
                                                <div className="icon-badge-s"><CheckCircle size={20} /></div>
                                                <div>
                                                    <h5>Cotización al instante</h5>
                                                    <p>Valuamos tu auto con datos reales del mercado</p>
                                                </div>
                                            </div>
                                            <div className="floating-card-s pos-2">
                                                <div className="icon-badge-s"><Clock size={20} /></div>
                                                <div>
                                                    <h5>Pago en el momento</h5>
                                                    <p>Transferencia segura después de la inspección</p>
                                                </div>
                                            </div>
                                        </Reveal>
                                    </div>
                                    <div className="staggered-text-box">
                                        <Reveal direction="up" duration={0.85} delay={0.4}>
                                            <h3>Vende tu auto en 3 simples pasos</h3>
                                        </Reveal>
                                        <div className="vertical-steps">
                                            <Reveal direction="up" duration={0.85} delay={0.6}>
                                                <div className="v-step">
                                                    <div className="v-badge">1</div>
                                                    <h4>Cotiza online</h4>
                                                    <p>Ingresa los datos de tu auto y recibe una oferta preliminar en segundos.</p>
                                                </div>
                                            </Reveal>
                                            <Reveal direction="up" duration={0.85} delay={0.8}>
                                                <div className="v-step">
                                                    <div className="v-badge">2</div>
                                                    <h4>Agenda tu cita</h4>
                                                    <p>Visítanos para una inspección física y mecánica de 240 puntos.</p>
                                                </div>
                                            </Reveal>
                                            <Reveal direction="up" duration={0.85} delay={1.0}>
                                                <div className="v-step">
                                                    <div className="v-badge">3</div>
                                                    <h4>Recibe tu pago</h4>
                                                    <p>Si todo está en orden, firmamos y te transferimos el dinero el mismo día.</p>
                                                </div>
                                            </Reveal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="section benefits-sell gray-bg">
                            <div className="container">
                                <Reveal direction="up" duration={0.85}>
                                    <h2 className="section-title">¿Por qué vender tu auto en TAKEOFF?</h2>
                                </Reveal>
                                <div className="benefits-grid-sell">
                                    <Reveal direction="up" duration={0.85} delay={0.2}>
                                        <div className="benefit-item-s">
                                            <div className="icon-teal"><Shield size={32} /></div>
                                            <h4>Seguridad total</h4>
                                            <p>Evita riesgos al vender a particulares. En TAKEOFF garantizamos transacciones seguras.</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="up" duration={0.85} delay={0.4}>
                                        <div className="benefit-item-s">
                                            <div className="icon-teal"><TrendingUp size={32} /></div>
                                            <h4>Mejor precio del mercado</h4>
                                            <p>Usamos algoritmos avanzados para darte la oferta más justa por tu vehículo.</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="up" duration={0.85} delay={0.6}>
                                        <div className="benefit-item-s">
                                            <div className="icon-teal"><Clock size={32} /></div>
                                            <h4>Proceso en el día</h4>
                                            <p>Desde la cotización hasta el pago, podemos completar todo en menos de 24 horas.</p>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </section>
                    </>
                )}

                {activeTab === 'cambia' && (
                    <section className="section section-staggered">
                        <div className="container">
                            <h2 className="section-title centered">Cambia tu auto por uno mejor en minutos</h2>
                            <p className="section-subtitle centered">Entregamos tu auto actual como parte del pago y llévate el que quieras.</p>

                            <div className="staggered-visual-section reverse">
                                <div className="staggered-img-box">
                                    <img src={sellCambiaImg} alt="Cambia tu auto" />
                                    <div className="floating-card-s pos-3">
                                        <div className="icon-badge-s blue"><TrendingUp size={20} /></div>
                                        <div>
                                            <h5>Mejoramos tu oferta</h5>
                                            <p>Bonificación extra al cambiar tu auto</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="staggered-text-box">
                                    <h3>Llévate el auto que siempre quisiste</h3>
                                    <div className="vertical-steps">
                                        <div className="v-step">
                                            <div className="v-badge blue">1</div>
                                            <h4>Cotiza tu auto actual</h4>
                                            <p>Obtén el valor de mercado para tu unidad en nuestro cotizador online.</p>
                                        </div>
                                        <div className="v-step">
                                            <div className="v-badge blue">2</div>
                                            <h4>Elige tu nuevo TAKEOFF</h4>
                                            <p>Explora nuestro catálogo con más de 500 opciones garantizadas.</p>
                                        </div>
                                        <div className="v-step">
                                            <div className="v-badge blue">3</div>
                                            <h4>Haz el intercambio</h4>
                                            <p>Nos traes tu auto, nosotros te entregamos el nuevo. ¡Así de fácil!</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}

                {activeTab === 'deja' && (
                    <section className="section section-staggered">
                        <div className="container">
                            <h2 className="section-title centered">Tu auto es el ingreso para tu próximo préstamo</h2>
                            <p className="section-subtitle centered">Usa el valor de tu auto para financiar tu próxima meta con nosotros.</p>

                            <div className="staggered-visual-section">
                                <div className="staggered-img-box">
                                    <img src={sellDejaImg} alt="Deja a cuenta" />
                                </div>
                                <div className="staggered-text-box">
                                    <h3>Financia aspiraciones con tu auto</h3>
                                    <div className="vertical-steps">
                                        <div className="v-step">
                                            <div className="v-badge teal">1</div>
                                            <h4>Valúa tu vehículo</h4>
                                            <p>Descubre cuánto de tu préstamo puede cubrir el valor de tu auto.</p>
                                        </div>
                                        <div className="v-step">
                                            <div className="v-badge teal">2</div>
                                            <h4>Define tu financiamiento</h4>
                                            <p>Elige plazos y montos que se adapten a tu capacidad de pago.</p>
                                        </div>
                                        <div className="v-step">
                                            <div className="v-badge teal">3</div>
                                            <h4>Acelera tus sueños</h4>
                                            <p>Cerramos el trato y te damos el impulso que necesitas hoy.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                )}
            </div>

            {/* SHARED SECTION: TRUST BANNERS */}
            <section className="trust-banners-s">
                <div className="container">
                    <div className="trust-grid-s">
                        <Reveal direction="up" duration={0.85} delay={0.1}>
                            <div className="trust-item-s">
                                <CheckCircle size={24} />
                                <span>Más de 10,000 autos comprados</span>
                            </div>
                        </Reveal>
                        <Reveal direction="up" duration={0.85} delay={0.3}>
                            <div className="trust-item-s">
                                <Shield size={24} />
                                <span>Inspección de 240 puntos</span>
                            </div>
                        </Reveal>
                        <Reveal direction="up" duration={0.85} delay={0.5}>
                            <div className="trust-item-s">
                                <Clock size={24} />
                                <span>Pago en menos de 24 horas</span>
                            </div>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* LOAN USES CAROUSEL (Replaces Testimonials) */}
            <section className="section loan-uses-section">
                <div className="container">
                    <div className="loan-carousel-header">
                        <h2 className="section-title">En TAKEOFF AUTO sí te damos crédito</h2>
                        <p className="section-subtitle">Si tienes un auto, tienes una solución</p>
                    </div>
                </div>

                <div className="loan-carousel-wrapper">
                    <div className="loan-carousel-track">
                        {[1, 2].map((i) => (
                            <React.Fragment key={i}>
                                <div className="loan-use-card">
                                    <img src={loanRefinancia} alt="Refinancia tus deudas" />
                                    <div className="loan-use-overlay">
                                        <h4>Refinancia tus deudas</h4>
                                    </div>
                                </div>
                                <div className="loan-use-card">
                                    <img src={loanEmergencia} alt="Previene emergencias médicas" />
                                    <div className="loan-use-overlay">
                                        <h4>Previene emergencias médicas o imprevistos</h4>
                                    </div>
                                </div>
                                <div className="loan-use-card">
                                    <img src={loanNegocio} alt="Impulsa tu negocio" />
                                    <div className="loan-use-overlay">
                                        <h4>Impulsa tu negocio</h4>
                                    </div>
                                </div>
                                <div className="loan-use-card">
                                    <img src={loanHogar} alt="Mejora tu hogar" />
                                    <div className="loan-use-overlay">
                                        <h4>Mejora tu hogar</h4>
                                    </div>
                                </div>
                                <div className="loan-use-card">
                                    <img src={loanFamilia} alt="Planea eventos" />
                                    <div className="loan-use-overlay">
                                        <h4>Planea eventos familiares o personales</h4>
                                    </div>
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                <div className="container" style={{ marginTop: '40px' }}>
                    <div className="whatsapp-help-banner">
                        <div className="whatsapp-content">
                            <MessageCircle size={20} color="#2161f2" />
                            <p>¿Necesitas ayuda? Te asesoramos y respondemos todas tus dudas. <a href={API_CONFIG.WHATSAPP_LINK} target="_blank" rel="noopener noreferrer">Habla con un asesor por WhatsApp &gt;</a></p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="section faq-section-s">
                <div className="container">
                    <Reveal direction="up" duration={0.85}>
                        <h2 className="section-title centered">Preguntas frecuentes</h2>
                    </Reveal>
                    <div className="faq-wrapper-s">
                        {faqs.map((faq, index) => (
                            <Reveal key={index} direction="up" duration={0.85} delay={index * 0.1}>
                                <div className={`faq-item-s ${openFaq === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                                    <div className="faq-question-s">
                                        <span>{faq.q}</span>
                                        <ChevronDown size={20} className="faq-arrow-s" />
                                    </div>
                                    {openFaq === index && (
                                        <div className="faq-answer-s">
                                            <p>{faq.a}</p>
                                        </div>
                                    )}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            <VideoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                videoData={selectedVideo}
            />
        </div>
    );
};

export default Sell;
