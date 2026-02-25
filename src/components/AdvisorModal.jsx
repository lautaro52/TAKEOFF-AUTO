import React, { useState } from 'react';
import { X, Send, User, Phone, Mail, MessageSquare, Loader2 } from 'lucide-react';
import { userService } from '../services/userService';
import './AdvisorModal.css';

const AdvisorModal = ({ isOpen, onClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        reason: 'consulta_general'
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await userService.createLead({
                client_name: formData.name,
                client_whatsapp: formData.phone,
                note: `CONTACTO ASESOR (Nosotros): Motivo: ${formData.reason}. Email: ${formData.email}`
            });

            if (res.success) {
                setSuccess(true);
                // Auto-close after 4 seconds
                setTimeout(() => {
                    onClose();
                    setSuccess(false);
                    setFormData({ name: '', phone: '', email: '', reason: 'consulta_general' });
                }, 4000);
            } else {
                alert('Error al registrar contacto');
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="advisor-modal-overlay" onClick={onClose}>
            <div className="advisor-modal-content" onClick={e => e.stopPropagation()}>
                <button className="advisor-modal-close" onClick={onClose}><X size={24} /></button>

                {!success ? (
                    <div className="advisor-form-wrapper">
                        <div className="advisor-header">
                            <div className="advisor-icon"><MessageSquare size={32} /></div>
                            <h2>Hablar con un Asesor</h2>
                            <p>Completá tus datos para brindarte una atención personalizada.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="advisor-form">
                            <div className="advisor-field">
                                <label><User size={16} /> Nombre</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Tu nombre"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="advisor-field">
                                <label><Phone size={16} /> WhatsApp</label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ej: 3511234567"
                                    value={formData.phone}
                                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                />
                            </div>
                            <div className="advisor-field">
                                <label><Mail size={16} /> Email (Opcional)</label>
                                <input
                                    type="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="advisor-field">
                                <label>Motivo de consulta</label>
                                <select
                                    value={formData.reason}
                                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                                >
                                    <option value="consulta_general">Consulta General</option>
                                    <option value="creditos">Créditos y Financiación</option>
                                    <option value="toma_usado">Toma de Usado</option>
                                    <option value="stock_especifico">Stock Específico</option>
                                </select>
                            </div>

                            <button type="submit" className="advisor-submit-btn" disabled={loading}>
                                {loading ? <><Loader2 className="animate-spin" size={20} /> Conectando...</> : <><Send size={18} /> CONTINUAR A WHATSAPP</>}
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="advisor-success">
                        <div className="success-icon">🚀</div>
                        <h3>¡Datos recibidos!</h3>
                        <p>Nuestro asesor <strong>Daniel</strong> te va a contactar por WhatsApp en segundos.</p>
                        <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>📱 Revisá tu WhatsApp</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdvisorModal;
