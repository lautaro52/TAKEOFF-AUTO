import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, CheckCircle, Shield, Clock, TrendingUp, MapPin, MessageCircle, Pencil } from 'lucide-react';
import { getCars } from '../services/carsService';
import DeliveryCarousel from '../components/DeliveryCarousel';
import ZeroKmShowcase from '../components/ZeroKmShowcase';
import PromiseCarousel from '../components/PromiseCarousel';
import './Credit.css';
import creditHero from '../assets/credit-hero.jpg';
import videoCredit from '../assets/video-credit.mp4';
import creditPoster from '../assets/credit-poster.jpg';
import Reveal from '../components/Reveal';

// Para evitar que la página falle si las fotos aún no existen, 
// usaremos las rutas como texto. Una vez subas las fotos, aparecerán solas.
const car1 = "/src/assets/car-meses-1.png";
const car2 = "/src/assets/car-meses-2.png";
const car3 = "/src/assets/car-meses-3.png";
const loanVisual = "/src/assets/loan-visual.png";

const Credit = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('usados'); // 'usados' o '0km'
    const [openFaq, setOpenFaq] = useState(null);
    const [carouselIndex, setCarouselIndex] = useState(0);

    // Track carousel scroll position for indicators + Auto-play (infinite loop)
    useEffect(() => {
        const carousel = document.querySelector('.financing-staggered-grid');
        if (!carousel) return;

        let autoPlayTimer;
        let lastInteraction = Date.now();
        let isResetting = false;

        const getCardWidth = () => 296; // 280px card + 16px gap

        const handleScroll = () => {
            if (isResetting) return;
            const scrollLeft = carousel.scrollLeft;
            const cardWidth = getCardWidth();
            const index = Math.round(scrollLeft / cardWidth);
            // Map clone positions (3,4,5) back to real dot positions (0,1,2)
            setCarouselIndex(index % 3);

            // Clone trick: if user manually scrolled into the duplicate section,
            // instantly teleport to the real card so looping feels seamless
            if (index >= 3) {
                isResetting = true;
                carousel.scrollTo({ left: (index - 3) * cardWidth, behavior: 'instant' });
                setTimeout(() => { isResetting = false; }, 50);
            }
        };

        const handleUserInteraction = () => {
            lastInteraction = Date.now();
        };

        const autoAdvance = () => {
            const timeSinceLastInteraction = Date.now() - lastInteraction;
            if (timeSinceLastInteraction < 2000 || isResetting) return;

            const cardWidth = getCardWidth();
            const currentIndex = Math.round(carousel.scrollLeft / cardWidth);
            const nextIndex = currentIndex + 1;

            if (nextIndex >= 3) {
                // Scroll smoothly to the duplicate (looks identical to card 0)
                carousel.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
                // After animation finishes, silently snap back to real card 0
                setTimeout(() => {
                    isResetting = true;
                    carousel.scrollTo({ left: 0, behavior: 'instant' });
                    setCarouselIndex(0);
                    setTimeout(() => { isResetting = false; }, 50);
                }, 500);
            } else {
                carousel.scrollTo({ left: nextIndex * cardWidth, behavior: 'smooth' });
            }
        };

        // Start auto-play interval
        autoPlayTimer = setInterval(autoAdvance, 2500);

        carousel.addEventListener('scroll', handleScroll, { passive: true });
        carousel.addEventListener('touchstart', handleUserInteraction, { passive: true });
        carousel.addEventListener('mousedown', handleUserInteraction);

        return () => {
            clearInterval(autoPlayTimer);
            carousel.removeEventListener('scroll', handleScroll);
            carousel.removeEventListener('touchstart', handleUserInteraction);
            carousel.removeEventListener('mousedown', handleUserInteraction);
        };
    }, []);

    // Auto-play for "Why Choose Us" carousel (Mobile only)
    useEffect(() => {
        const whyCarousel = document.querySelector('.why-grid');
        if (!whyCarousel) return;

        let autoPlayTimer;
        let lastInteraction = Date.now();
        const AUTOPLAY_INTERVAL = 4000; // 4 seconds
        const PAUSE_AFTER_INTERACTION = 5000; // Pause for 5s after user interaction

        const handleUserInteraction = () => {
            lastInteraction = Date.now();
        };

        const autoAdvance = () => {
            const timeSinceLastInteraction = Date.now() - lastInteraction;

            // Only auto-advance if user hasn't interacted recently
            if (timeSinceLastInteraction >= PAUSE_AFTER_INTERACTION) {
                const cardWidth = 280 + 16; // card width + gap
                const currentScroll = whyCarousel.scrollLeft;
                const currentIndex = Math.round(currentScroll / cardWidth);
                const nextIndex = (currentIndex + 1) % 3; // Loop: 0 -> 1 -> 2 -> 0

                whyCarousel.scrollTo({
                    left: nextIndex * cardWidth,
                    behavior: 'smooth'
                });
            }
        };

        // Start auto-play interval
        autoPlayTimer = setInterval(autoAdvance, AUTOPLAY_INTERVAL);

        // Listen to touch/mouse events to pause auto-play
        whyCarousel.addEventListener('touchstart', handleUserInteraction);
        whyCarousel.addEventListener('mousedown', handleUserInteraction);

        return () => {
            clearInterval(autoPlayTimer);
            whyCarousel.removeEventListener('touchstart', handleUserInteraction);
            whyCarousel.removeEventListener('mousedown', handleUserInteraction);
        };
    }, []);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const carFinancing = [
        {
            image: "https://www.mazda.mx/content/dam/mazda/mx/vehiculos/mazda3-sedan/2024/versiones/i/m3s-i-blanco-ceramico.png",
            name: "Mazda 3 i Sport",
            price: "$355.000",
            monthly: "$6.250",
            year: "2022"
        },
        {
            image: "https://www.toyota.mx/sites/default/files/corolla-2024-color-blanco.png",
            name: "Toyota Corolla SE",
            price: "$380.000",
            monthly: "$7.100",
            year: "2023"
        },
        {
            image: "https://www.vw.com.mx/idhub/content/dam/onehub_pkw/importers/mx/modelos/jetta/cortes/JETTA-2024-CORTES-COMFORTLINE-BLANCO.png",
            name: "VW Jetta Comfortline",
            price: "$365.000",
            monthly: "$6.500",
            year: "2022"
        }
    ];

    const faqs = [
        {
            q: "¿Cómo es el proceso de compra?",
            a: "Seleccioná tu unidad desde nuestro catálogo de stock real, simulá tu cuota personalizada con nuestras calculadoras financieras y asesorate las 24hs con nuestro Agente Virtual para agendar tu cita y cerrar el negocio de forma simple y transparente."
        },
        {
            q: "¿Qué requisitos piden para el crédito?",
            a: "Los requisitos varían según la financiera: desde solo DNI hasta recibo de sueldo o monotributo para acceder a mejores tasas. Nuestro Agente Virtual pre-califica tu perfil automáticamente para ofrecerte el plan que mejor se adapte a tus posibilidades."
        },
        {
            q: "Puedo usar mi auto como forma de pago?",
            a: "Sí, aceptamos permutas. Solo debés cargar los datos de tu vehículo y te contactaremos con una oferta competitiva. Para mantener la calidad de nuestro stock, todas las unidades deben superar una inspección mecánica rigurosa antes de ser aprobadas como parte de pago o para su venta directa."
        },
        {
            q: "¿Cuál es el plazo máximo de financiamiento?",
            a: "Ofrece plazos flexibles que van desde los 12 hasta los 72 meses, adaptándonos perfectamente a tu capacidad de pago mensual."
        }
    ];

    return (
        <div className="credit-page">
            {/* HER0 SECTION */}
            <section className="credit-hero">
                <video
                    className="hero-video-bg"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    poster={creditPoster}
                    onLoadedData={(e) => e.target.play()}
                >
                    <source src={videoCredit} type="video/mp4" />
                </video>
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1 className="hero-title">Dos caminos, la misma seguridad.</h1>
                    <p className="hero-subtitle">Comprá tu usado certificado o estrená un 0km con confianza.</p>

                    <div className="hero-search-label">¿Qué estás buscando?</div>

                    <div className="hero-cards">
                        <div className={`hero-card-k ${activeTab === 'usados' ? 'active' : ''}`} onClick={() => setActiveTab('usados')}>
                            <div className="card-brand-tag">TAKEOFF <span className="blue-text">USADO</span></div>
                            <h3>Usados certificados con financiación del 100%</h3>
                            <span className="card-link-blue">Ver catálogo <ChevronRight size={16} /></span>
                        </div>
                        <div className={`hero-card-k ${activeTab === '0km' ? 'active' : ''}`} onClick={() => setActiveTab('0km')}>
                            <div className="card-brand-tag">TAKEOFF <span className="teal-text">0km</span></div>
                            <h3>Tu 0km con transparencia y pacto claro</h3>
                            <span className="card-link-blue">Ver unidades <ChevronRight size={16} /></span>
                        </div>
                    </div>
                </div>
            </section>

            {/* QUICK TABS SELECTOR */}
            <div className="tabs-container">
                <div className="tabs-switcher">
                    <button
                        className={`tab-btn-pill ${activeTab === 'usados' ? 'active' : ''}`}
                        onClick={() => setActiveTab('usados')}
                    >
                        TAKEOFF <span className="tab-blue">USADO</span>
                    </button>
                    <button
                        className={`tab-btn-pill ${activeTab === '0km' ? 'active' : ''}`}
                        onClick={() => setActiveTab('0km')}
                    >
                        TAKEOFF <span className="tab-teal">0km</span>
                    </button>
                </div>
            </div>

            {activeTab === 'usados' ? (
                <>
                    {/* AUTO FINANCING CALCULATOR PREVIEW */}
                    <section id="calculadora" className="section financing-preview">
                        <div className="container">
                            <Reveal direction="up" duration={1.2}>
                                <h2 className="section-title">Usados Certificados - Financiamos el 100%</h2>
                            </Reveal>
                            <Reveal direction="up" duration={1.2} delay={0.4}>
                                <p className="section-subtitle">Sin entrega inicial. Hasta 72 cuotas. Llevate tu auto hoy.</p>
                            </Reveal>

                            <div className="financing-staggered-grid">
                                <Reveal direction="left" duration={1.2} delay={0.5}>
                                    <div className="financing-staggered-card">
                                        <div className="car-top-label">Usado Certificado</div>
                                        <div className="staggered-img-container">
                                            <img src={car1} alt="Fiat Cronos Drive 2021" />
                                        </div>
                                        <div className="staggered-info">
                                            <div className="staggered-title">Fiat Cronos Drive 2021 • $21.560.000</div>
                                            <div className="staggered-monthly">
                                                <span className="monthly-val">$ 475.998/mes</span>
                                            </div>
                                            <div className="staggered-footer">
                                                Págalo en <span className="blue-link-text">60 meses</span>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal direction="up" duration={1.2} delay={0.7}>
                                    <div className="financing-staggered-card featured">
                                        <div className="car-top-label">Usado Certificado</div>
                                        <div className="staggered-img-container">
                                            <img src={car2} alt="Fiat Toro Freedom 2021" />
                                        </div>
                                        <div className="staggered-info">
                                            <div className="staggered-title">Fiat Toro Freedom 2021 • $32.340.000</div>
                                            <div className="staggered-monthly">
                                                <span className="monthly-val">$ 952.150/mes</span>
                                            </div>
                                            <div className="staggered-footer">
                                                Págalo en <span className="blue-link-text">72 meses (Tasa 0%)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                <Reveal direction="right" duration={1.2} delay={0.9}>
                                    <div className="financing-staggered-card">
                                        <div className="car-top-label">Usado Certificado</div>
                                        <div className="staggered-img-container">
                                            <img src={car3} alt="Volkswagen Gol Power 2013" />
                                        </div>
                                        <div className="staggered-info">
                                            <div className="staggered-title">Volkswagen Gol Power 2013 • $11.760.000</div>
                                            <div className="staggered-monthly">
                                                <span className="monthly-val">$ 291.577/mes</span>
                                            </div>
                                            <div className="staggered-footer">
                                                Págalo en <span className="blue-link-text">48 meses (Línea UVA)</span>
                                            </div>
                                        </div>
                                    </div>
                                </Reveal>

                                {/* === CLONES FOR INFINITE LOOP (mobile only, hidden on desktop) === */}
                                <div className="financing-staggered-card financing-carousel-dup" aria-hidden="true">
                                    <div className="car-top-label">Usado Certificado</div>
                                    <div className="staggered-img-container">
                                        <img src={car1} alt="" />
                                    </div>
                                    <div className="staggered-info">
                                        <div className="staggered-title">Fiat Cronos Drive 2021 • $21.560.000</div>
                                        <div className="staggered-monthly">
                                            <span className="monthly-val">$ 475.998/mes</span>
                                        </div>
                                        <div className="staggered-footer">
                                            Págalo en <span className="blue-link-text">60 meses</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="financing-staggered-card featured financing-carousel-dup" aria-hidden="true">
                                    <div className="car-top-label">Usado Certificado</div>
                                    <div className="staggered-img-container">
                                        <img src={car2} alt="" />
                                    </div>
                                    <div className="staggered-info">
                                        <div className="staggered-title">Fiat Toro Freedom 2021 • $32.340.000</div>
                                        <div className="staggered-monthly">
                                            <span className="monthly-val">$ 952.150/mes</span>
                                        </div>
                                        <div className="staggered-footer">
                                            Págalo en <span className="blue-link-text">72 meses (Tasa 0%)</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="financing-staggered-card financing-carousel-dup" aria-hidden="true">
                                    <div className="car-top-label">Usado Certificado</div>
                                    <div className="staggered-img-container">
                                        <img src={car3} alt="" />
                                    </div>
                                    <div className="staggered-info">
                                        <div className="staggered-title">Volkswagen Gol Power 2013 • $11.760.000</div>
                                        <div className="staggered-monthly">
                                            <span className="monthly-val">$ 291.577/mes</span>
                                        </div>
                                        <div className="staggered-footer">
                                            Págalo en <span className="blue-link-text">48 meses (Línea UVA)</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Carousel Indicators (Mobile Only) */}
                            <div className="carousel-indicators">
                                <div className={`indicator-dot ${carouselIndex === 0 ? 'active' : ''}`}></div>
                                <div className={`indicator-dot ${carouselIndex === 1 ? 'active' : ''}`}></div>
                                <div className={`indicator-dot ${carouselIndex === 2 ? 'active' : ''}`}></div>
                            </div>
                            <div className="center-btn" style={{ marginTop: '30px' }}>
                                <button className="btn-primary-k big-blue" onClick={() => navigate('/catalogo')}>Ver catálogo de Usados</button>
                            </div>
                        </div>
                    </section>

                    {/* STEPS SECTION */}
                    <section className="section steps-section-staggered">
                        <div className="container">
                            <div className="steps-split-layout">
                                <Reveal direction="left" duration={1.2} className="steps-left-col">
                                    <h2 className="steps-main-title">Comprá tu Usado Certificado</h2>
                                    <button onClick={() => navigate('/catalogo')} className="comenzar-ahora-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        Comenzar ahora <ChevronRight size={18} />
                                    </button>
                                </Reveal>
                                <div className="steps-right-col">
                                    <Reveal direction="right" duration={1.2} delay={0.2} className="step-card-k">
                                        <div className="step-badge">1</div>
                                        <div>
                                            <h4>Busca tu auto en nuestro catálogo</h4>
                                            <p>Filtra y encuentra autos para tu presupuesto</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="right" duration={1.2} delay={0.4} className="step-card-k">
                                        <div className="step-badge">2</div>
                                        <div>
                                            <h4>Elige tu ingreso y simula tu plan de pagos</h4>
                                            <p>Ingresa tus datos y descubre las opciones que tenemos para ti</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="right" duration={1.2} delay={0.6} className="step-card-k">
                                        <div className="step-badge">3</div>
                                        <div>
                                            <h4>Compra tu auto</h4>
                                            <p>Personaliza tu plan y decide a cuantos meses quieres pagar</p>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BLUE BENEFITS SECTION */}
                    <section className="section benefits-blue">
                        <div className="container">
                            <Reveal direction="up" duration={1.2}>
                                <div className="benefits-header">
                                    <h2>Las ventajas de nuestros Usados Certificados</h2>
                                    <a href="#" className="link-white">Más información <ChevronRight size={16} /></a>
                                </div>
                            </Reveal>
                            <div className="benefits-row">
                                <Reveal direction="up" duration={1.2} delay={0.2} className="benefit-col">
                                    <CheckCircle size={32} />
                                    <p>Financiá hasta en 72 cuotas con una entrega inicial mínima del 30%</p>
                                </Reveal>
                                <Reveal direction="up" duration={1.2} delay={0.4} className="benefit-col">
                                    <Shield size={32} />
                                    <p>Cuotas Fijas y Créditos UVA</p>
                                </Reveal>
                                <Reveal direction="up" duration={1.2} delay={0.6} className="benefit-col">
                                    <Clock size={32} />
                                    <p>Calculá tu plan en 60 segundos</p>
                                </Reveal>
                                <Reveal direction="up" duration={1.2} delay={0.8} className="benefit-col">
                                    <TrendingUp size={32} />
                                    <p>Unidades con respaldo de 3 meses en caja y motor</p>
                                </Reveal>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* LOAN SECTION - 0KM SHOWCASE */}
                    <section className="section loans-section">
                        <div className="container">
                            <Reveal direction="up" duration={1.2}>
                                <h2 className="section-title">TU 0KM A TASA 0%: SIN INTERÉS NI SORPRESAS</h2>
                            </Reveal>
                            <Reveal direction="up" duration={1.2} delay={0.3}>
                                <p className="section-subtitle">Accedé al stock más completo con entrega inmediata. Financiá en 18 cuotas fijas y simulá tu plan a medida en segundos con nuestra IA.</p>
                            </Reveal>

                            <Reveal direction="scale" duration={1.2} delay={0.5}>
                                <ZeroKmShowcase />
                            </Reveal>

                            <Reveal direction="up" duration={1.2} delay={0.7}>
                                <div className="center-btn" style={{ marginTop: '20px' }}>
                                    <button className="btn-primary-k big-blue" onClick={() => window.open('https://wa.me/5493516752879?text=Hola,%20quiero%20un%20Auto%200km', '_blank')}>Consulta el Mejor Plan</button>
                                </div>
                            </Reveal>
                        </div>
                    </section>

                    {/* STEPS SECTION LOANS */}
                    <section className="section steps-section-staggered">
                        <div className="container">
                            <div className="steps-split-layout">
                                <Reveal direction="left" duration={1.2} className="steps-left-col">
                                    <h2 className="steps-main-title">Pedí tu 0km ahora</h2>
                                    <button onClick={() => navigate('/catalogo')} className="comenzar-ahora-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        Comenzar ahora <ChevronRight size={18} />
                                    </button>
                                </Reveal>
                                <div className="steps-right-col">
                                    <Reveal direction="right" duration={1.2} delay={0.2} className="step-card-k">
                                        <div className="step-badge">1</div>
                                        <div>
                                            <h4>ELEGÍ TU UNIDAD 0KM</h4>
                                            <p>Explorá el catálogo con stock real de las mejores marcas y seleccioná el modelo que buscás.</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="right" duration={1.2} delay={0.4} className="step-card-k">
                                        <div className="step-badge">2</div>
                                        <div>
                                            <h4>SIMULÁ TU TASA 0%</h4>
                                            <p>Usá nuestra calculadora para armar tu plan en 18 cuotas fijas y sin interés de forma inmediata.</p>
                                        </div>
                                    </Reveal>
                                    <Reveal direction="right" duration={1.2} delay={0.6} className="step-card-k">
                                        <div className="step-badge">3</div>
                                        <div>
                                            <h4>RESERVÁ Y RETIRÁ</h4>
                                            <p>Pre-calificá con nuestra IA, agendá tu cita en el salón y retirá tu unidad con garantía oficial.</p>
                                        </div>
                                    </Reveal>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* GREEN BENEFITS SECTION */}
                    <section className="section benefits-teal">
                        <div className="container">
                            <div className="benefits-header">
                                <h2>Beneficios de comprar tu 0km con TAKEOFF</h2>
                                <a href="#" className="link-white">Más información <ChevronRight size={16} /></a>
                            </div>
                            <div className="benefits-row">
                                <div className="benefit-col">
                                    <CheckCircle size={32} />
                                    <p>Tasa 0% en 18 cuotas fijas para ganarle a la inflación.</p>
                                </div>
                                <div className="benefit-col">
                                    <Shield size={32} />
                                    <p>Stock real con entrega inmediata sin esperas de planes largos.</p>
                                </div>
                                <div className="benefit-col">
                                    <Clock size={32} />
                                    <p>Simulación digital y pre-aprobación con IA en solo 60 segundos.</p>
                                </div>
                                <div className="benefit-col">
                                    <TrendingUp size={32} />
                                    <p>Garantía oficial de fábrica en todas nuestras unidades 0km disponibles.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            )}

            <section id="promesas" className="section deliveries-section">
                <div className="container">
                    <Reveal direction="up" duration={1.2}>
                        <h2 className="section-title">Nuestra promesa TakeOff</h2>
                        <PromiseCarousel />
                    </Reveal>
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="section why-choose">
                <div className="container">
                    <Reveal direction="up" duration={1.2}>
                        <h2 className="section-title">¿Por qué elegirnos?</h2>
                    </Reveal>
                    <div className="why-grid">
                        <Reveal direction="up" duration={1.2} delay={0.2} className="why-item">
                            <MessageCircle className="icon-teal" />
                            <h4>Atención personalizada</h4>
                            <p>Contamos con múltiples asesores, disponibles para acompañarte en el proceso.</p>
                        </Reveal>
                        <Reveal direction="up" duration={1.2} delay={0.4} className="why-item">
                            <CheckCircle className="icon-teal" />
                            <h4>Altas tasas de aprobación</h4>
                            <p>Aprobamos a 4 de cada 5 personas que solicitan un préstamo.</p>
                        </Reveal>
                        <Reveal direction="up" duration={1.2} delay={0.6} className="why-item">
                            <Pencil className="icon-teal" />
                            <h4>Préstamos a medida</h4>
                            <p>Te damos la oportunidad de personalizar el pago de tu préstamo.</p>
                        </Reveal>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="section faq-section gray-bg">
                <div className="container">
                    <Reveal direction="up" duration={1.2}>
                        <h2 className="section-title">Qué tienes que saber</h2>
                    </Reveal>
                    <Reveal direction="up" duration={1.2} delay={0.3} className="faq-wrapper">
                        {faqs.map((faq, index) => (
                            <div key={index} className={`faq-item ${openFaq === index ? 'open' : ''}`} onClick={() => toggleFaq(index)}>
                                <div className="faq-question">
                                    <span>{faq.q}</span>
                                    <ChevronDown size={20} className="faq-arrow" />
                                </div>
                                <div className="faq-answer">
                                    <p>{faq.a}</p>
                                </div>
                            </div>
                        ))}
                    </Reveal>
                </div>
            </section>
        </div>
    );
};

export default Credit;
