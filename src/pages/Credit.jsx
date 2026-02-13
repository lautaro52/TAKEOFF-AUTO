import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronDown, CheckCircle, Shield, Clock, TrendingUp, MapPin, MessageCircle, Pencil } from 'lucide-react';
import { getCars } from '../services/carsService';
import DeliveryCarousel from '../components/DeliveryCarousel';
import ZeroKmShowcase from '../components/ZeroKmShowcase';
import './Credit.css';
import creditHero from '../assets/credit-hero.jpg';

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

    useEffect(() => {
        const observerOptions = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Opcional: dejar de observar una vez visible
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const revealElements = document.querySelectorAll('.reveal');
        revealElements.forEach(el => observer.observe(el));

        return () => {
            revealElements.forEach(el => observer.unobserve(el));
        };
    }, [activeTab]); // Reiniciar observador cuando cambie el tab ya que el contenido cambia

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
            <section
                className="credit-hero"
                style={{ backgroundImage: `url(${creditHero})` }}
            >
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <h1>Llegaste a TAKEOFF AUTO CRÉDITO</h1>
                    <p>No miramos tu historial, miramos tu historia</p>
                    <div className="hero-cards">
                        <div className={`hero-card ${activeTab === 'usados' ? 'active' : ''}`} onClick={() => setActiveTab('usados')}>
                            <div className="card-brand-tag">TAKEOFF <span className="blue-text">USADOS</span></div>
                            <h3>Usados certificados con financiación del 100%.</h3>
                            <span className="card-link">Conoce más <ChevronRight size={16} /></span>
                        </div>
                        <div className={`hero-card ${activeTab === '0km' ? 'active' : ''}`} onClick={() => setActiveTab('0km')}>
                            <div className="card-brand-tag">TAKEOFF <span className="teal-text">0KM</span></div>
                            <h3>Tu 0km con transparencia y Pacto Claro.</h3>
                            <span className="card-link">Ver unidades <ChevronRight size={16} /></span>
                        </div>
                    </div>
                    <div className="hero-search-label">¿Qué estás buscando?</div>
                </div>
            </section>

            {/* QUICK TABS SELECTOR */}
            <div className="tabs-container">
                <div className="tabs-switcher">
                    <button
                        className={`tab-btn ${activeTab === 'usados' ? 'active' : ''}`}
                        onClick={() => setActiveTab('usados')}
                    >
                        TAKEOFF <span className="tab-blue">USADOS</span>
                    </button>
                    <button
                        className={`tab-btn ${activeTab === '0km' ? 'active' : ''}`}
                        onClick={() => setActiveTab('0km')}
                    >
                        TAKEOFF <span className="tab-teal">0KM</span>
                    </button>
                </div>
            </div>

            {activeTab === 'usados' ? (
                <>
                    {/* AUTO FINANCING CALCULATOR PREVIEW */}
                    <section className="section financing-preview">
                        <div className="container">
                            <h2 className="section-title reveal reveal-bottom">Usados Certificados - Financiamos el 100%</h2>
                            <p className="section-subtitle reveal reveal-bottom delay-100">Sin entrega inicial. Hasta 72 cuotas. Llevate tu auto hoy.</p>

                            <div className="financing-staggered-grid">
                                {/* CARD 1: FIAT CRONOS */}
                                <div className="financing-staggered-card reveal reveal-left delay-200">
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

                                {/* CARD 2: FIAT TORO (FEATURED) */}
                                <div className="financing-staggered-card featured reveal reveal-bottom delay-400">
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

                                {/* CARD 3: VW GOL */}
                                <div className="financing-staggered-card reveal reveal-right delay-600">
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
                            </div>
                            <div className="center-btn" style={{ marginTop: '30px' }}>
                                <button className="btn-primary-k big-blue" onClick={() => navigate('/login')}>Solicitar financiamiento</button>
                            </div>
                        </div>
                    </section>

                    {/* STEPS SECTION */}
                    <section className="section steps-section-staggered">
                        <div className="container">
                            <div className="steps-split-layout">
                                <div className="steps-left-col reveal reveal-left">
                                    <h2 className="steps-main-title">Comprá tu Usado Certificado</h2>
                                    <button onClick={() => navigate('/catalogo')} className="comenzar-ahora-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        Comenzar ahora <ChevronRight size={18} />
                                    </button>
                                </div>
                                <div className="steps-right-col">
                                    <div className="step-card-k reveal reveal-right delay-100">
                                        <div className="step-badge">1</div>
                                        <h4>Elige tu ingreso y simula tu plan de pagos</h4>
                                        <p>Ingresa tus datos y descubre las opciones que tenemos para ti</p>
                                    </div>
                                    <div className="step-card-k reveal reveal-right delay-200">
                                        <div className="step-badge">2</div>
                                        <h4>Busca tu auto en nuestro catálogo</h4>
                                        <p>Filtra y encuentra autos para tu presupuesto</p>
                                    </div>
                                    <div className="step-card-k reveal reveal-right delay-300">
                                        <div className="step-badge">3</div>
                                        <h4>Compra tu auto</h4>
                                        <p>Personaliza tu plan y decide a cuantos meses quieres pagar</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* BLUE BENEFITS SECTION */}
                    <section className="section benefits-blue">
                        <div className="container">
                            <div className="benefits-header reveal reveal-bottom">
                                <h2>Las ventajas de nuestros Usados Certificados</h2>
                                <a href="#" className="link-white">Más información <ChevronRight size={16} /></a>
                            </div>
                            <div className="benefits-row">
                                <div className="benefit-col reveal reveal-bottom delay-100">
                                    <CheckCircle size={32} />
                                    <p>Financiá hasta en 72 cuotas con una entrega inicial mínima del 30%</p>
                                </div>
                                <div className="benefit-col reveal reveal-bottom delay-200">
                                    <Shield size={32} />
                                    <p>Cuotas Fijas y Créditos UVA</p>
                                </div>
                                <div className="benefit-col reveal reveal-bottom delay-300">
                                    <Clock size={32} />
                                    <p>Calculá tu plan en 60 segundos</p>
                                </div>
                                <div className="benefit-col reveal reveal-bottom delay-400">
                                    <TrendingUp size={32} />
                                    <p>Unidades con respaldo de 3 meses en caja y motor</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </>
            ) : (
                <>
                    {/* LOAN SECTION - 0KM SHOWCASE */}
                    <section className="section loans-section">
                        <div className="container">
                            <h2 className="section-title reveal reveal-bottom">TU 0KM A TASA 0%: SIN INTERÉS NI SORPRESAS</h2>
                            <p className="section-subtitle reveal reveal-bottom delay-100">Accedé al stock más completo con entrega inmediata. Financiá en 18 cuotas fijas y simulá tu plan a medida en segundos con nuestra IA.</p>

                            <div className="reveal reveal-scale delay-200">
                                <ZeroKmShowcase />
                            </div>

                            <div className="center-btn reveal reveal-bottom delay-400" style={{ marginTop: '20px' }}>
                                <button className="btn-primary-k big-blue" onClick={() => window.open('https://wa.me/5493516752879?text=Hola,%20quiero%20un%20Auto%200km', '_blank')}>Consulta el Mejor Plan</button>
                            </div>
                        </div>
                    </section>

                    {/* STEPS SECTION LOANS */}
                    <section className="section steps-section-staggered">
                        <div className="container">
                            <div className="steps-split-layout">
                                <div className="steps-left-col reveal reveal-left">
                                    <h2 className="steps-main-title">Pedí tu 0km ahora</h2>
                                    <button onClick={() => navigate('/catalogo')} className="comenzar-ahora-link" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
                                        Comenzar ahora <ChevronRight size={18} />
                                    </button>
                                </div>
                                <div className="steps-right-col">
                                    <div className="step-card-k reveal reveal-right delay-100">
                                        <div className="step-badge">1</div>
                                        <h4>ELEGÍ TU UNIDAD 0KM</h4>
                                        <p>Explorá el catálogo con stock real de las mejores marcas y seleccioná el modelo que buscás.</p>
                                    </div>
                                    <div className="step-card-k reveal reveal-right delay-200">
                                        <div className="step-badge">2</div>
                                        <h4>SIMULÁ TU TASA 0%</h4>
                                        <p>Usá nuestra calculadora para armar tu plan en 18 cuotas fijas y sin interés de forma inmediata.</p>
                                    </div>
                                    <div className="step-card-k reveal reveal-right delay-300">
                                        <div className="step-badge">3</div>
                                        <h4>RESERVÁ Y RETIRÁ</h4>
                                        <p>Pre-calificá con nuestra IA, agendá tu cita en el salón y retirá tu unidad con garantía oficial.</p>
                                    </div>
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

            {/* DELIVERY CAROUSEL SECTION */}
            <section className="section deliveries-section">
                <div className="container">
                    <h2 className="section-title">Entregas que nos enorgullecen</h2>
                    <DeliveryCarousel />
                </div>
            </section>

            {/* WHY CHOOSE US */}
            <section className="section why-choose">
                <div className="container">
                    <h2 className="section-title reveal reveal-bottom">¿Por qué elegirnos?</h2>
                    <div className="why-grid">
                        <div className="why-item reveal reveal-bottom delay-100">
                            <MessageCircle className="icon-teal" />
                            <h4>Atención personalizada</h4>
                            <p>Contamos con múltiples asesores, disponibles para acompañarte en el proceso.</p>
                        </div>
                        <div className="why-item reveal reveal-bottom delay-200">
                            <CheckCircle className="icon-teal" />
                            <h4>Altas tasas de aprobación</h4>
                            <p>Aprobamos a 4 de cada 5 personas que solicitan un préstamo.</p>
                        </div>
                        <div className="why-item reveal reveal-bottom delay-300">
                            <Pencil className="icon-teal" />
                            <h4>Préstamos a medida</h4>
                            <p>Te damos la oportunidad de personalizar el pago de tu préstamo.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION */}
            <section className="section faq-section gray-bg">
                <div className="container">
                    <h2 className="section-title reveal reveal-bottom">Qué tienes que saber</h2>
                    <div className="faq-wrapper reveal reveal-bottom delay-200">
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
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Credit;
