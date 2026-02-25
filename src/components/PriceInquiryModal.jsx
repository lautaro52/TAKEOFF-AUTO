import React, { useState } from 'react';
import { MessageCircle, X, Send, User, Phone, Mail, FileText } from 'lucide-react';
import { API_CONFIG } from '../config';
import './PriceInquiryModal.css';

const PriceInquiryModal = ({ isOpen, onClose, car }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [consultationId, setConsultationId] = useState('');

    if (!isOpen) return null;

    const isZeroKm = car?.home_section === '0km' || car?.km === 0;
    const vehicleLabel = `${car?.brand} ${car?.model}${car?.year ? ` ${car.year}` : ''}`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/api/price_inquiry.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    car_id: car?.id,
                    car_brand: car?.brand,
                    car_model: car?.model,
                    car_year: car?.year,
                    is_zero_km: isZeroKm
                })
            });
            const data = await res.json();
            if (data.success) {
                setSuccess(true);
                setConsultationId(data.consultation_id || '');
            } else {
                alert(data.message || 'Error al enviar la consulta');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('Error de conexión. Intenta nuevamente.');
        }
        setLoading(false);
    };



    const handleClose = () => {
        onClose();
        setSuccess(false);
        setFormData({ name: '', phone: '', email: '', message: '' });
    };

    return (
        <div className="price-inquiry-overlay" onClick={handleClose}>
            <div className="price-inquiry-modal" onClick={(e) => e.stopPropagation()}>
                <button className="price-inquiry-close" onClick={handleClose}>
                    <X size={20} />
                </button>

                {!success ? (
                    <>
                        <div className="price-inquiry-header">
                            <div className="price-inquiry-icon">
                                <MessageCircle size={28} />
                            </div>
                            <h2>Consultar Precio</h2>
                            <p className="price-inquiry-vehicle">{vehicleLabel}</p>
                            <p className="price-inquiry-subtitle">
                                {isZeroKm
                                    ? 'Dejanos tus datos y un asesor te contactará con la mejor cotización 0km'
                                    : 'Dejanos tus datos y te enviaremos la cotización actualizada'
                                }
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="price-inquiry-form">
                            <div className="price-inquiry-field">
                                <User size={16} className="field-icon" />
                                <input
                                    type="text"
                                    placeholder="Tu nombre completo"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="price-inquiry-field">
                                <Phone size={16} className="field-icon" />
                                <input
                                    type="tel"
                                    placeholder="Tu WhatsApp (ej: 3516752879)"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '') })}
                                    required
                                />
                            </div>
                            <div className="price-inquiry-field">
                                <Mail size={16} className="field-icon" />
                                <input
                                    type="email"
                                    placeholder="Tu email (opcional)"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="price-inquiry-field">
                                <FileText size={16} className="field-icon" />
                                <textarea
                                    placeholder="¿Algún comentario? (opcional)"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    rows={3}
                                />
                            </div>
                            <button type="submit" className="price-inquiry-submit" disabled={loading}>
                                {loading ? 'Enviando...' : 'Enviar Consulta'}
                                {!loading && <Send size={16} />}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="price-inquiry-success">
                        <div className="price-inquiry-success-icon">🚀</div>
                        <h2>¡Consulta enviada!</h2>
                        <p>Nuestro asesor <strong>Daniel</strong> te contactará por WhatsApp en segundos.</p>
                        <p className="price-inquiry-vehicle">{vehicleLabel}</p>
                        {consultationId && (
                            <p style={{ fontSize: '13px', color: '#999', marginTop: '8px' }}>
                                Referencia: <strong>{consultationId}</strong>
                            </p>
                        )}
                        <p style={{ fontSize: '14px', color: '#666', marginTop: '12px' }}>
                            📱 Revisá tu WhatsApp, te va a llegar un mensaje en breve.
                        </p>
                        <button className="price-inquiry-close-btn" onClick={handleClose}>
                            Entendido
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PriceInquiryModal;
