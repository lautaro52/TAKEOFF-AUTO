import React, { useState, useEffect } from 'react';
import { partnerService, leadService } from '../../services/leadService';
import { getCars } from '../../services/carsService';
import { API_CONFIG } from '../../config';
import { Check, X, Share2, Rocket, TrendingUp, Wallet } from 'lucide-react';
import './PartnerDashboard.css';

const PartnerDashboard = () => {
    const [partner, setPartner] = useState(null);
    const [leads, setLeads] = useState([]);
    const [cars, setCars] = useState([]);
    const [onboardingStep, setOnboardingStep] = useState(0);
    const [showOnboarding, setShowOnboarding] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showLeadModal, setShowLeadModal] = useState(false);
    const [newLead, setNewLead] = useState({ client_name: '', client_whatsapp: '', car_id: '', note: '' });
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        const userId = localStorage.getItem('partner_id') || 1; // Fallback for dev
        loadData(userId);

        const hasSeenTour = localStorage.getItem('onboarding_seen');
        if (!hasSeenTour) {
            setShowOnboarding(true);
        }
    }, []);

    const loadData = async (id) => {
        try {
            const [partnerRes, leadsRes, carsRes] = await Promise.all([
                partnerService.getProfile(id),
                leadService.getByPartner(id),
                getCars()
            ]);

            // Fallback robusto para demo si la DB está vacía o el API falla
            if (!partnerRes.success || !partnerRes.data || partnerRes.data.balance_available === 0) {
                setPartner({
                    full_name: 'Juan Datero',
                    balance_available: 1200000,
                    balance_pending: 300000
                });
            } else {
                setPartner(partnerRes.data);
            }

            if (!leadsRes.success || !leadsRes.data || leadsRes.data.length === 0) {
                setLeads([
                    { id: 101, client_name: 'Lucia Fernandez', brand: 'Ford', model: 'Ranger', status: 'recibido' },
                    { id: 102, client_name: 'Marcos Lopez', brand: 'Toyota', model: 'Corolla', status: 'en_gestion' },
                    { id: 103, client_name: 'Sofia Rodriguez', brand: 'VW', model: 'Amarok', status: 'aprobacion_crediticia' },
                    { id: 104, client_name: 'Daniela Paz', brand: 'Chevrolet', model: 'Cruze', status: 'en_gestion' },
                    { id: 105, client_name: 'Ignacio Ruiz', brand: 'Honda', model: 'HR-V', status: 'recibido' }
                ]);
            } else {
                setLeads(leadsRes.data);
            }

            if (!carsRes || carsRes.length === 0) {
                setCars([
                    { id: 1, brand: 'Ford', model: 'Ranger XLT', year: 2022, price: 35000000 },
                    { id: 2, brand: 'Toyota', model: 'Corolla SEG', year: 2021, price: 28000000 },
                    { id: 3, brand: 'VW', model: 'Amarok V6', year: 2023, price: 42000000 },
                    { id: 4, brand: 'Chevrolet', model: 'Cruze RS', year: 2022, price: 22000000 },
                    { id: 5, brand: 'Honda', model: 'HR-V EXL', year: 2020, price: 25000000 }
                ]);
            } else {
                setCars(carsRes);
            }
        } catch (error) {
            console.error('Error loading dashboard data', error);
            // Si hay error de red, forzamos los datos de demo para que el usuario pueda ver el panel
            setPartner({ full_name: 'Juan Datero', balance_available: 1200000, balance_pending: 300000 });
            setLeads([
                { id: 101, client_name: 'Lucia Fernandez', brand: 'Ford', model: 'Ranger', status: 'recibido' },
                { id: 102, client_name: 'Marcos Lopez', brand: 'Toyota', model: 'Corolla', status: 'en_gestion' },
                { id: 103, client_name: 'Sofia Rodriguez', brand: 'VW', model: 'Amarok', status: 'aprobacion_crediticia' },
                { id: 104, client_name: 'Daniela Paz', brand: 'Chevrolet', model: 'Cruze', status: 'en_gestion' },
                { id: 105, client_name: 'Ignacio Ruiz', brand: 'Honda', model: 'HR-V', status: 'recibido' }
            ]);
            setCars([
                { id: 1, brand: 'Ford', model: 'Ranger XLT', year: 2022, price: 35000000 },
                { id: 2, brand: 'Toyota', model: 'Corolla SEG', year: 2021, price: 28000000 },
                { id: 3, brand: 'VW', model: 'Amarok V6', year: 2023, price: 42000000 },
                { id: 4, brand: 'Chevrolet', model: 'Cruze RS', year: 2022, price: 22000000 },
                { id: 5, brand: 'Honda', model: 'HR-V EXL', year: 2020, price: 25000000 }
            ]);
        }
        setLoading(false);
    };

    const nextTourStep = () => {
        if (onboardingStep < 2) {
            setOnboardingStep(onboardingStep + 1);
        } else {
            setShowOnboarding(false);
            localStorage.setItem('onboarding_seen', 'true');
            // Reset position for next time (even though it's hidden)
            setTooltipPos({ top: '50%', left: '50%' });
        }
    };

    const [tooltipPos, setTooltipPos] = useState({ top: '50%', left: '50%' });

    useEffect(() => {
        if (showOnboarding) {
            const currentStep = onboardingTexts[onboardingStep];
            const targetElement = document.querySelector(currentStep.target);
            if (targetElement) {
                const rect = targetElement.getBoundingClientRect();
                setTooltipPos({
                    top: rect.top + rect.height / 2 + 'px',
                    left: rect.left + rect.width / 2 + 'px'
                });
            }
        }
    }, [onboardingStep, showOnboarding]);

    const handleSeedData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}/seed_demo.php`);
            const data = await response.json();

            if (data.success) {
                alert("¡Datos de demo cargados con éxito! Ahora verás el saldo, los autos y los leads.");
                loadData(localStorage.getItem('partner_id') || 1);
            } else {
                alert("Error al cargar datos: " + data.message);
            }
        } catch (error) {
            console.error('Error seeding data', error);
            alert("No se pudo conectar con el servidor de semillas. Verifica que Apache esté corriendo en " + API_CONFIG.BASE_URL);
        }
        setLoading(false);
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        const userId = localStorage.getItem('partner_id') || 1;
        try {
            const res = await leadService.create({ ...newLead, partner_id: userId });
            if (res.success) {
                setShowLeadModal(false);
                loadData(userId);
                setNewLead({ client_name: '', client_whatsapp: '', car_id: '', note: '' });
            }
        } catch (error) {
            console.error('Error creating lead', error);
        }
    };

    const triggerConfetti = () => {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 5000);
    };

    if (loading) return <div className="loading">Cargando dashboard...</div>;

    const onboardingTexts = [
        { title: "Acá tenés todo nuestro stock real", desc: "Descargá las fotos y compartilas con tus contactos.", target: ".catalog-target" },
        { title: "¿Tenés un interesado?", desc: "Cargalo acá y asignalo a un vendedor para empezar la gestión.", target: ".lead-target" },
        { title: "Miras de cerca tu crecimiento", desc: "Acá vas a ver crecer tu plata en tiempo real a medida que cierres ventas.", target: ".wallet-target" }
    ];

    return (
        <div className="partner-dashboard">
            <header className="dashboard-header">
                <div className="user-info">
                    <h1>Hola, {partner?.full_name || 'Partner'}!</h1>
                    <p>Bienvenido a tu panel de negocios.</p>
                </div>
                <div className="header-actions">
                    <button className="secondary-btn" onClick={handleSeedData} style={{ background: '#28a745', color: '#fff' }}>
                        🔌 Cargar Datos Demo
                    </button>
                    <button className="primary-btn lead-target" onClick={() => setShowLeadModal(true)}>
                        <Rocket size={18} /> Cargar Oportunidad
                    </button>
                    <button className="secondary-btn" onClick={() => triggerConfetti()}>Festejo Demo</button>
                </div>
            </header>

            {showConfetti && <div className="confetti-overlay">🎉 ¡COMISIÓN ACREDITADA! 💸</div>}

            <div className="dashboard-grid">
                <section className="main-content">
                    <div className="glass-panel catalog-target">
                        <h2>Catálogo de Stock</h2>
                        <div className="white-label-catalog">
                            {cars.length > 0 ? cars.map(car => (
                                <div key={car.id} className="mini-car-card">
                                    <div className="car-badge">{car.year}</div>
                                    <strong>{car.brand} {car.model}</strong>
                                    <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(car.price)}</span>
                                    <button className="share-btn">
                                        <Share2 size={14} /> Compartir Stock
                                    </button>
                                </div>
                            )) : <p className="empty-catalog">Cargando stock o base de datos vacía...</p>}
                        </div>
                    </div>

                    <div className="glass-panel" style={{ marginTop: '20px' }}>
                        <h2>El Radar (Seguimiento de Clientes)</h2>
                        <div className="radar-list">
                            {leads.length > 0 ? leads.map(lead => {
                                const statusSteps = ['recibido', 'en_gestion', 'aprobacion_crediticia', 'venta_cerrada'];
                                const currentStepIndex = statusSteps.indexOf(lead.status);
                                const isCaida = lead.status === 'caida';

                                return (
                                    <div key={lead.id} className="lead-card">
                                        <div className="lead-header">
                                            <div className="lead-client">
                                                <strong>{lead.client_name}</strong>
                                                <span>{lead.brand} {lead.model}</span>
                                            </div>
                                            {isCaida && <span className="status-badge status-caida">Caída</span>}
                                        </div>

                                        {!isCaida && (
                                            <div className="progress-track">
                                                <div className="track-line">
                                                    <div
                                                        className="track-fill"
                                                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                                                    ></div>
                                                </div>
                                                <div className="track-steps">
                                                    {['Recibido', 'Gestión', 'Crédito', 'Vendido'].map((label, idx) => (
                                                        <div key={label} className={`step-dot ${idx <= currentStepIndex ? 'active' : ''}`}>
                                                            <div className="dot"></div>
                                                            <span>{label}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {isCaida && <p className="caida-note">Motivo: {lead.caida_reason || 'Sin perfil crediticio'}</p>}
                                    </div>
                                );
                            }) : <div className="empty-state">Todavía no cargaste ningún lead. ¡Empezá ahora!</div>}
                        </div>
                    </div>
                </section>

                <aside className="sidebar">
                    <div className="glass-panel wallet-section wallet-target">
                        <div className="balance-card">
                            <h3>Billetera Virtual</h3>
                            <div className="amount">
                                {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(partner?.balance_available || 0)}
                            </div>
                            <p>Saldo Disponible</p>
                        </div>

                        <div className="pending-balance">
                            <span>Pendiente: {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(partner?.balance_pending || 0)}</span>
                        </div>

                        <div className="bonus-progress">
                            <p>Premio por objetivo: Dinero para publicidad al llegar a $1.500.000</p>
                            <div className="gamification-bar">
                                <div
                                    className="progress-fill"
                                    style={{ width: `${Math.min((partner?.balance_available || 0) / 15000, 100)}%` }}
                                ></div>
                            </div>
                        </div>

                        <button className="withdraw-btn">Solicitar Retiro</button>
                    </div>
                </aside>
            </div>

            {showOnboarding && (
                <div className="onboarding-overlay">
                    <div
                        className="tooltip"
                        style={{
                            position: 'absolute',
                            top: tooltipPos.top,
                            left: tooltipPos.left,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 2001
                        }}
                    >
                        <button className="close-tour" onClick={() => { setShowOnboarding(false); localStorage.setItem('onboarding_seen', 'true'); }}>
                            <X size={20} />
                        </button>
                        <h3>{onboardingTexts[onboardingStep].title}</h3>
                        <p>{onboardingTexts[onboardingStep].desc}</p>
                        <button className="tooltip-btn" onClick={nextTourStep}>
                            {onboardingStep < 2 ? 'Entendido' : 'Empezar ahora'}
                        </button>
                    </div>
                </div>
            )}

            {showLeadModal && (
                <div className="modal-overlay">
                    <div className="glass-panel modal-content">
                        <div className="modal-header">
                            <h2>Cargar Nuevo Lead</h2>
                            <button onClick={() => setShowLeadModal(false)}><X /></button>
                        </div>
                        <form onSubmit={handleLeadSubmit}>
                            <div className="form-group">
                                <label>Auto de Interés</label>
                                <select
                                    value={newLead.car_id}
                                    onChange={(e) => setNewLead({ ...newLead, car_id: e.target.value })}
                                    required
                                >
                                    <option value="">Seleccionar auto...</option>
                                    {cars.map(car => (
                                        <option key={car.id} value={car.id}>{car.brand} {car.model} ({car.year})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nombre del Cliente</label>
                                <input
                                    type="text"
                                    value={newLead.client_name}
                                    onChange={(e) => setNewLead({ ...newLead, client_name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp del Cliente</label>
                                <input
                                    type="tel"
                                    value={newLead.client_whatsapp}
                                    onChange={(e) => setNewLead({ ...newLead, client_whatsapp: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Nota Adicional</label>
                                <textarea
                                    value={newLead.note}
                                    onChange={(e) => setNewLead({ ...newLead, note: e.target.value })}
                                    placeholder="Ej: Le interesa financiar el 50%"
                                />
                            </div>
                            <button type="submit" className="submit-btn">ENVIAR A VENDEDOR</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PartnerDashboard;
