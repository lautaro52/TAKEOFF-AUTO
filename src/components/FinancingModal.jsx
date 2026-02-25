import React, { useState, useEffect } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { API_CONFIG } from '../config';
import { userService } from '../services/userService';
import './FinancingModal.css';

const FinancingModal = ({ isOpen, onClose, car, initialDownPayment }) => {
    const [selectedBank, setSelectedBank] = useState(null);
    const [imageErrors, setImageErrors] = useState({});
    const [showLeadForm, setShowLeadForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    // Lead Form State
    const [leadData, setLeadData] = useState({
        name: '',
        dni: '',
        email: '',
        whatsapp: ''
    });

    const carName = car ? `${car.brand} ${car.model} ${car.year}` : '';
    const carPrice = car ? (car.arsPrice || Number(car.price)) : 0;
    const price = carPrice || 0;
    const [downPayment, setDownPayment] = useState(initialDownPayment || Math.round(price * 0.2));
    const [term, setTerm] = useState(36);
    const [bancorPlan, setBancorPlan] = useState('uva'); // 'uva' or 'fija'

    // Update downPayment and reset view when modal opens or price changes
    useEffect(() => {
        if (isOpen) {
            setSelectedBank(null);
            setShowLeadForm(false);
            setIsSuccess(false);
            setDownPayment(initialDownPayment || Math.round(price * 0.2));

            const currentUser = userService.getCurrentUser();
            if (currentUser) {
                setLeadData({
                    name: currentUser.full_name || '',
                    dni: currentUser.dni || '',
                    email: currentUser.email || '',
                    whatsapp: currentUser.whatsapp || ''
                });
            } else {
                setLeadData({ name: '', dni: '', email: '', whatsapp: '' });
            }
        }
    }, [isOpen, price, initialDownPayment]);

    if (!isOpen) return null;

    const minDownPayment = Math.round(price * 0.2);

    const bancorUvaFactors = {
        12: 97.51,
        24: 55.80,
        36: 42.11,
        48: 35.42,
        60: 31.54
    };

    const bancorFijaFactors = {
        12: 110.97,
        24: 69.38,
        36: 56.77,
        48: 50.78,
        60: 47.58,
        72: 45.70
    };

    const galiciaFactors = {
        12: 129.72,
        24: 89.92,
        36: 78.44,
        48: 73.79,
        60: 71.66
    };

    const santanderFactors = {
        12: 83.33,
        18: 61.74,
        24: 47.83
    };

    const bnaFactors = {
        12: 108.11,
        18: 80.38,
        24: 66.76,
        36: 53.59,
        48: 47.45,
        60: 44.08,
        72: 42.06
    };

    const calculateInstallment = (selectedTerm, bank = selectedBank) => {
        const amountToFinance = price - downPayment;
        if (amountToFinance <= 0) return 0;

        let factors;
        if (bank === 'galicia') factors = galiciaFactors;
        else if (bank === 'santander') factors = santanderFactors;
        else if (bank === 'bancor') factors = bancorPlan === 'uva' ? bancorUvaFactors : bancorFijaFactors;
        else if (bank === 'bna') factors = bnaFactors;
        else return 0;

        const factor = factors[selectedTerm];
        return factor ? (amountToFinance / 1000) * factor : 0;
    };

    const handleBankSelect = (bankId) => {
        setSelectedBank(bankId);
        if (bankId === 'santander') {
            setTerm(12);
        } else if (bankId === 'bancor') {
            setBancorPlan('uva');
            setTerm(12);
        } else if (bankId === 'bna') {
            setTerm(12);
        } else {
            setTerm(36);
        }
    };

    const handleDownPaymentChange = (e) => {
        const value = parseInt(e.target.value.replace(/\D/g, '')) || 0;
        setDownPayment(value);
    };

    const handleLeadInputChange = (e) => {
        const { name, value } = e.target;
        setLeadData(prev => ({ ...prev, [name]: value }));
    };

    const handleLeadSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const currentInstallment = Math.round(calculateInstallment(term));

        // 1. Prepare WhatsApp Message
        const whatsappNumber = API_CONFIG.WHATSAPP_NUMBER;
        const message = `Hola, mi nombre es ${leadData.name}. Estoy interesado en financiar un ${carName}.
        
*Detalles de mi solicitud:*
- DNI: ${leadData.dni}
- Email: ${leadData.email}
- WhatsApp: ${leadData.whatsapp}

*Plan de Financiación:*
- Banco: ${selectedBank.toUpperCase()}
- Entrega Inicial: $${downPayment.toLocaleString('es-AR')}
- Plazo: ${term} meses
- Cuota Aprox: $${currentInstallment.toLocaleString('es-AR')}

Precio del auto: $${price.toLocaleString('es-AR')}`;

        const encodedMessage = encodeURIComponent(message);

        // 2. Try sending Email (Silent failure to allow WhatsApp to proceed)
        try {
            // CRM Integration
            await userService.createLead({
                client_name: leadData.name,
                client_whatsapp: leadData.whatsapp,
                car_id: car.id,
                partner_id: car.partner_id || null, // If car has a partner, associate it
                note: `Interés en financiación: ${selectedBank.toUpperCase()}, Plazo: ${term} meses, Cuota: $${currentInstallment.toLocaleString('es-AR')}. Email: ${leadData.email}. DNI: ${leadData.dni}`
            });

            // Email Notification
            await fetch(`${API_CONFIG.BASE_URL}/send_financing_lead.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...leadData,
                    carName,
                    carPrice: price,
                    bank: selectedBank,
                    downPayment,
                    term,
                    installment: currentInstallment
                })
            });
        } catch (error) {
            console.error('Lead ingestion or Email notification failed:', error);
            // We proceed to WhatsApp anyway as requested by the user
        }

        // 3. Open WhatsApp Message (Always triggered)
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');

        setIsSuccess(true);
        setIsSubmitting(false);
    };

    const banks = [
        {
            id: 'galicia',
            name: 'BANCO GALICIA',
            className: 'galicia',
            color: '#FF8200',
            action: () => handleBankSelect('galicia')
        },
        {
            id: 'santander',
            name: 'SANTANDER RIO',
            className: 'santander',
            color: '#EC0000',
            action: () => handleBankSelect('santander')
        },
        {
            id: 'bancor',
            name: 'BANCOR',
            className: 'bancor',
            color: '#005CB9',
            action: () => handleBankSelect('bancor')
        },
        {
            id: 'bna',
            name: 'BANCO NACIÓN',
            className: 'bna',
            color: '#003893',
            action: () => handleBankSelect('bna')
        }
    ];

    const renderBankSelection = () => (
        <>
            <div className="modal-header">
                <h2>Elegí Tu Cuota</h2>
                <p>Seleccioná el banco de tu preferencia para simular tu préstamo</p>
            </div>

            <div className="banks-grid">
                {banks.map((bank) => (
                    <div key={bank.id} className={`bank-block ${bank.className}`}>
                        <div className="bank-logo-placeholder" style={{ color: bank.color }}>
                            {!imageErrors[bank.id] ? (
                                <img
                                    src={`/assets/logos/${bank.id}.png`}
                                    alt={bank.name}
                                    onError={() => setImageErrors(prev => ({ ...prev, [bank.id]: true }))}
                                />
                            ) : (
                                bank.name
                            )}
                        </div>
                        <button
                            className="btn-calculate"
                            onClick={() => bank.action ? bank.action() : window.open(bank.url, '_blank')}
                        >
                            IR A CALCULADORA
                        </button>
                    </div>
                ))}
            </div>
        </>
    );

    const renderBancorCalculator = () => {
        const isDownPaymentValid = downPayment >= 0; // Bancor allows 100% financing
        const currentFactors = bancorPlan === 'uva' ? bancorUvaFactors : bancorFijaFactors;
        const terms = Object.keys(currentFactors).map(Number);

        return (
            <div className="bancor-calculator">
                <button className="back-btn" onClick={() => setSelectedBank(null)}>
                    <ChevronLeft size={20} /> Volver
                </button>

                <div className="calc-header">
                    <h2 style={{ color: '#005CB9' }}>Simulador Bancor</h2>
                    <p style={{ fontWeight: 'bold' }}>¡Financia hasta el 100% de tu auto!</p>

                    <div className="plan-tabs">
                        <button
                            className={bancorPlan === 'uva' ? 'active' : ''}
                            onClick={() => { setBancorPlan('uva'); setTerm(12); }}
                        >
                            UVA (22% TNA)
                        </button>
                        <button
                            className={bancorPlan === 'fija' ? 'active' : ''}
                            onClick={() => { setBancorPlan('fija'); setTerm(12); }}
                        >
                            TASA FIJA (42% TNA)
                        </button>
                    </div>
                </div>

                <div className="calc-body">
                    <div className="calc-inputs-section">
                        <div className="calc-field">
                            <label>Precio del auto</label>
                            <div className="static-value">
                                ${Number(car.price).toLocaleString('es-AR')}
                                {car.isUSD && <span style={{ marginLeft: '4px', opacity: 0.7 }}>USD</span>}
                            </div>
                        </div>

                        <div className="calc-field">
                            <label>Monto de ingreso (Opcional - Bancor financia hasta 100%)</label>
                            <div className="input-with-symbol">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="text"
                                    value={downPayment.toLocaleString('es-AR')}
                                    onChange={handleDownPaymentChange}
                                    className={!isDownPaymentValid ? 'error' : ''}
                                />
                            </div>
                            <span className="info-text" style={{ color: '#005CB9' }}>Podés financiar el total del vehículo sin entrega inicial</span>
                        </div>

                        <div className="calc-field">
                            <label>Plazo en meses</label>
                            <div className="term-selector">
                                {terms.map(m => (
                                    <button
                                        key={m}
                                        className={term === m ? 'active' : ''}
                                        style={{ borderColor: term === m ? '#005CB9' : '', backgroundColor: term === m ? '#005CB9' : '' }}
                                        onClick={() => setTerm(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="calc-results-section">
                        <div className="result-card" style={{ backgroundColor: '#F0F7FF', borderColor: '#BADDFF' }}>
                            <div className="result-label" style={{ color: '#004A99' }}>Tu cuota mensual aproximada</div>
                            <div className="result-value" style={{ color: '#005CB9' }}>
                                {isDownPaymentValid && currentFactors[term] ? (
                                    `$ ${Math.round(calculateInstallment(term, 'bancor')).toLocaleString('es-AR')}`
                                ) : (
                                    '--'
                                )}
                            </div>
                            <div className="result-detail">
                                {isDownPaymentValid && (
                                    <>
                                        <span>Monto a financiar: ${Math.round(price - downPayment).toLocaleString('es-AR')}</span>
                                        <span>TNA: {bancorPlan === 'uva' ? '22.00% + UVA' : '42.00%'}</span>
                                        <span>Amortización: Francés</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="disclaimer-text">
                            * Gasto de otorgamiento: 5% + IVA.
                            {bancorPlan === 'uva' ? ' El valor de la cuota varía mensualmente según el índice UVA.' : ' Cuotas fijas en pesos.'}
                            Sujeto a aprobación crediticia de Bancor.
                        </div>

                        <button
                            className="btn-primary-calc"
                            style={{ backgroundColor: '#005CB9' }}
                            disabled={!isDownPaymentValid}
                            onClick={() => setShowLeadForm(true)}
                        >
                            SOLICITAR CRÉDITO
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderBNACalculator = () => {
        const isDownPaymentValid = downPayment >= 0;
        const terms = Object.keys(bnaFactors).map(Number);

        return (
            <div className="bna-calculator">
                <button className="back-btn" onClick={() => setSelectedBank(null)}>
                    <ChevronLeft size={20} /> Volver
                </button>

                <div className="calc-header">
                    <h2 style={{ color: '#003893' }}>Simulador Banco Nación</h2>
                    <p style={{ fontWeight: 'bold' }}>¡Financiación exclusiva hasta el 100%!</p>
                </div>

                <div className="calc-body">
                    <div className="calc-inputs-section">
                        <div className="calc-field">
                            <label>Precio del auto</label>
                            <div className="static-value">
                                ${Number(car.price).toLocaleString('es-AR')}
                                {car.isUSD && <span style={{ marginLeft: '4px', opacity: 0.7 }}>USD</span>}
                            </div>
                        </div>

                        <div className="calc-field">
                            <label>Monto de ingreso (Opcional - BNA financia hasta 100%)</label>
                            <div className="input-with-symbol">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="text"
                                    value={downPayment.toLocaleString('es-AR')}
                                    onChange={handleDownPaymentChange}
                                    className={!isDownPaymentValid ? 'error' : ''}
                                />
                            </div>
                            <span className="info-text" style={{ color: '#003893' }}>Podés financiar el total del vehículo</span>
                        </div>

                        <div className="calc-field">
                            <label>Plazo en meses</label>
                            <div className="term-selector">
                                {terms.map(m => (
                                    <button
                                        key={m}
                                        className={term === m ? 'active' : ''}
                                        style={{ borderColor: term === m ? '#003893' : '', backgroundColor: term === m ? '#003893' : '' }}
                                        onClick={() => setTerm(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="calc-results-section">
                        <div className="result-card" style={{ backgroundColor: '#F0F4FA', borderColor: '#D1D9E6' }}>
                            <div className="result-label" style={{ color: '#002A6D' }}>Tu cuota mensual aproximada</div>
                            <div className="result-value" style={{ color: '#003893' }}>
                                {isDownPaymentValid && bnaFactors[term] ? (
                                    `$ ${Math.round(calculateInstallment(term, 'bna')).toLocaleString('es-AR')}`
                                ) : (
                                    '--'
                                )}
                            </div>
                            <div className="result-detail">
                                {isDownPaymentValid && (
                                    <>
                                        <span>Monto a financiar: ${Math.round(price - downPayment).toLocaleString('es-AR')}</span>
                                        <span>TNA fija: 34,00%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="disclaimer-text">
                            * Gastos de otorgamiento: 3% + IVA.
                            Cuotas fijas en pesos. Sujeto a aprobación crediticia de Banco Nación.
                        </div>

                        <button
                            className="btn-primary-calc"
                            style={{ backgroundColor: '#003893' }}
                            disabled={!isDownPaymentValid}
                            onClick={() => setShowLeadForm(true)}
                        >
                            SOLICITAR CRÉDITO
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderSantanderCalculator = () => {
        const isDownPaymentValid = downPayment >= minDownPayment;

        return (
            <div className="santander-calculator">
                <button className="back-btn" onClick={() => setSelectedBank(null)}>
                    <ChevronLeft size={20} /> Volver
                </button>

                <div className="calc-header">
                    <h2 style={{ color: '#EC0000' }}>Simulador Santander Rio</h2>
                    <p style={{ fontWeight: 'bold', color: '#B00000' }}>PLAN ESPECIAL UVA TASA CERO</p>
                </div>

                <div className="calc-body">
                    <div className="calc-inputs-section">
                        <div className="calc-field">
                            <label>Precio del auto</label>
                            <div className="static-value">
                                ${Number(car.price).toLocaleString('es-AR')}
                                {car.isUSD && <span style={{ marginLeft: '4px', opacity: 0.7 }}>USD</span>}
                            </div>
                        </div>

                        <div className="calc-field">
                            <label>Monto de ingreso (mín. 20%)</label>
                            <div className="input-with-symbol">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="text"
                                    value={downPayment.toLocaleString('es-AR')}
                                    onChange={handleDownPaymentChange}
                                    className={!isDownPaymentValid ? 'error' : ''}
                                />
                            </div>
                            {!isDownPaymentValid && (
                                <span className="field-error">El ingreso mínimo debe ser ${minDownPayment.toLocaleString('es-AR')} (20%)</span>
                            )}
                        </div>

                        <div className="calc-field">
                            <label>Plazo en cuotas UVA</label>
                            <div className="term-selector">
                                {[12, 18, 24].map(m => (
                                    <button
                                        key={m}
                                        className={term === m ? 'active' : ''}
                                        style={{ borderColor: term === m ? '#EC0000' : '', backgroundColor: term === m ? '#EC0000' : '' }}
                                        onClick={() => setTerm(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="calc-results-section">
                        <div className="result-card" style={{ backgroundColor: '#FFF5F5', borderColor: '#FFD1D1' }}>
                            <div className="result-label" style={{ color: '#C00000' }}>Tu cuota mensual inicial (UVA)</div>
                            <div className="result-value" style={{ color: '#EC0000' }}>
                                {isDownPaymentValid && santanderFactors[term] ? (
                                    `$ ${Math.round(calculateInstallment(term, 'santander')).toLocaleString('es-AR')}`
                                ) : (
                                    '--'
                                )}
                            </div>
                            <div className="result-detail">
                                {isDownPaymentValid && (
                                    <>
                                        <span>Monto a financiar: ${Math.round(price - downPayment).toLocaleString('es-AR')}</span>
                                        <span>Tasa: {term === 12 ? '0.00%' : '9.90%'} + UVA</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="disclaimer-text">
                            * Cuota calculada en UVAS. El valor de la cuota varía mensualmente según el índice UVA.
                            Gasto de otorgamiento: {term === 12 ? '16.5%' : term === 18 ? '15.5%' : '19%'} + IVA.
                            Sujeto a aprobación crediticia de Banco Santander.
                        </div>

                        <button
                            className="btn-primary-calc"
                            style={{ backgroundColor: '#EC0000' }}
                            disabled={!isDownPaymentValid}
                            onClick={() => setShowLeadForm(true)}
                        >
                            SOLICITAR CRÉDITO
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const renderGaliciaCalculator = () => {
        const isDownPaymentValid = downPayment >= minDownPayment;

        return (
            <div className="galicia-calculator">
                <button className="back-btn" onClick={() => setSelectedBank(null)}>
                    <ChevronLeft size={20} /> Volver
                </button>

                <div className="calc-header">
                    <h2 style={{ color: '#FF8200' }}>Simulador Banco Galicia</h2>
                    <p>Calculá tu préstamo prendario para este auto</p>
                </div>

                <div className="calc-body">
                    <div className="calc-inputs-section">
                        <div className="calc-field">
                            <label>Precio del auto</label>
                            <div className="static-value">
                                ${Number(car.price).toLocaleString('es-AR')}
                                {car.isUSD && <span style={{ marginLeft: '4px', opacity: 0.7 }}>USD</span>}
                            </div>
                        </div>

                        <div className="calc-field">
                            <label>Monto de ingreso (mín. 20%)</label>
                            <div className="input-with-symbol">
                                <span className="currency-symbol">$</span>
                                <input
                                    type="text"
                                    value={downPayment.toLocaleString('es-AR')}
                                    onChange={handleDownPaymentChange}
                                    className={!isDownPaymentValid ? 'error' : ''}
                                />
                            </div>
                            {!isDownPaymentValid && (
                                <span className="field-error">El ingreso mínimo debe ser ${minDownPayment.toLocaleString('es-AR')} (20%)</span>
                            )}
                        </div>

                        <div className="calc-field">
                            <label>Plazo en meses</label>
                            <div className="term-selector">
                                {[12, 24, 36, 48, 60].map(m => (
                                    <button
                                        key={m}
                                        className={term === m ? 'active' : ''}
                                        onClick={() => setTerm(m)}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="calc-results-section">
                        <div className="result-card">
                            <div className="result-label">Tu cuota mensual aproximada</div>
                            <div className="result-value">
                                {isDownPaymentValid ? (
                                    `$ ${Math.round(calculateInstallment(term, 'galicia')).toLocaleString('es-AR')}`
                                ) : (
                                    '--'
                                )}
                            </div>
                            <div className="result-detail">
                                {isDownPaymentValid && (
                                    <>
                                        <span>Monto a financiar: ${Math.round(price - downPayment).toLocaleString('es-AR')}</span>
                                        <span>TNA: 69,00%</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="disclaimer-text">
                            * Cuota calculada según tasa TNA de 69,00%. Sujeto a aprobación crediticia de Banco Galicia. No incluye gastos de otorgamiento ni seguros.
                        </div>

                        <button
                            className="btn-primary-calc"
                            disabled={!isDownPaymentValid}
                            onClick={() => setShowLeadForm(true)}
                        >
                            SOLICITAR CRÉDITO
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="financing-modal-overlay" onClick={onClose}>
            <div className="financing-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-modal-btn" onClick={onClose}>
                    <X size={24} />
                </button>

                {isSuccess ? (
                    <div className="lead-success">
                        <div className="success-icon">✅</div>
                        <h2>¡Solicitud Enviada!</h2>
                        <p>Hemos recibido tus datos y se ha abierto tu WhatsApp para contactar con un asesor.</p>
                        <button className="btn-primary-calc" onClick={onClose} style={{ marginTop: '20px' }}>ACEPTAR</button>
                    </div>
                ) : showLeadForm ? (
                    <div className="lead-form-container">
                        <button className="back-btn" onClick={() => setShowLeadForm(false)}>
                            <ChevronLeft size={20} /> Volver al presupuesto
                        </button>
                        <div className="modal-header">
                            <h2>Datos para tu Solicitud</h2>
                            <p>Completá la información para que un asesor pueda procesar tu crédito.</p>
                        </div>
                        <form onSubmit={handleLeadSubmit} className="lead-form">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input name="name" type="text" value={leadData.name} onChange={handleLeadInputChange} required placeholder="Como figura en tu DNI" />
                            </div>
                            <div className="form-group">
                                <label>DNI</label>
                                <input name="dni" type="text" value={leadData.dni} onChange={handleLeadInputChange} required placeholder="Sin puntos" />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input name="email" type="email" value={leadData.email} onChange={handleLeadInputChange} required placeholder="ejemplo@correo.com" />
                            </div>
                            <div className="form-group">
                                <label>WhatsApp</label>
                                <input name="whatsapp" type="tel" value={leadData.whatsapp} onChange={handleLeadInputChange} required placeholder="+54 9 ..." />
                            </div>
                            <button type="submit" className="btn-primary-calc" disabled={isSubmitting} style={{ marginTop: '20px' }}>
                                {isSubmitting ? 'ENVIANDO...' : 'CONTINUAR'}
                            </button>
                        </form>
                    </div>
                ) : (
                    <>
                        {selectedBank === 'galicia' && renderGaliciaCalculator()}
                        {selectedBank === 'santander' && renderSantanderCalculator()}
                        {selectedBank === 'bancor' && renderBancorCalculator()}
                        {selectedBank === 'bna' && renderBNACalculator()}
                        {!selectedBank && renderBankSelection()}
                    </>
                )}
            </div>
        </div>
    );
};

export default FinancingModal;
