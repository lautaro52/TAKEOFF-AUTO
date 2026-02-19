import React, { useState, useEffect } from 'react';
import { X, Phone, Mail, Calendar, MessageCircle, FileText, Car, Users } from 'lucide-react';
import { createActivity } from '../../services/crmService';
import './CRMModals.css';

const ActivityModal = ({ isOpen, onClose, customerId, opportunityId, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customer_id: customerId || '',
        opportunity_id: opportunityId || '',
        activity_type: 'call',
        subject: '',
        description: '',
        outcome: 'successful',
        duration_minutes: '',
        activity_date: new Date().toISOString().slice(0, 16),
        car_id: ''
    });

    useEffect(() => {
        if (isOpen && !customerId) {
            resetForm();
        }
    }, [isOpen]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const resetForm = () => {
        setFormData({
            customer_id: customerId || '',
            opportunity_id: opportunityId || '',
            activity_type: 'call',
            subject: '',
            description: '',
            outcome: 'successful',
            duration_minutes: '',
            activity_date: new Date().toISOString().slice(0, 16),
            car_id: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.subject.trim()) {
            newErrors.subject = 'El asunto es requerido';
        }

        if (!formData.customer_id) {
            newErrors.customer_id = 'Debe seleccionar un cliente';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            await createActivity(formData);

            if (onSave) {
                onSave();
            }
            onClose();
        } catch (error) {
            console.error('Error saving activity:', error);
            alert('Error al guardar la actividad');
        } finally {
            setLoading(false);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={16} />;
            case 'email': return <Mail size={16} />;
            case 'meeting': return <Calendar size={16} />;
            case 'whatsapp': return <MessageCircle size={16} />;
            case 'note': return <FileText size={16} />;
            case 'test_drive': return <Car size={16} />;
            case 'visit': return <Users size={16} />;
            default: return <FileText size={16} />;
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Registrar Actividad</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Tipo de Actividad</label>
                        <div className="activity-type-grid">
                            {[
                                { value: 'call', label: 'Llamada', icon: 'call' },
                                { value: 'email', label: 'Email', icon: 'email' },
                                { value: 'meeting', label: 'Reunión', icon: 'meeting' },
                                { value: 'whatsapp', label: 'WhatsApp', icon: 'whatsapp' },
                                { value: 'note', label: 'Nota', icon: 'note' },
                                { value: 'test_drive', label: 'Test Drive', icon: 'test_drive' },
                                { value: 'visit', label: 'Visita', icon: 'visit' },
                                { value: 'sms', label: 'SMS', icon: 'sms' }
                            ].map((type) => (
                                <button
                                    key={type.value}
                                    type="button"
                                    className={`activity-type-btn ${formData.activity_type === type.value ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, activity_type: type.value })}
                                >
                                    {getActivityIcon(type.icon)}
                                    <span>{type.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Asunto *</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className={errors.subject ? 'error' : ''}
                                placeholder="Ej: Llamada de seguimiento"
                            />
                            {errors.subject && <span className="error-message">{errors.subject}</span>}
                        </div>

                        <div className="form-group">
                            <label>Resultado</label>
                            <select
                                value={formData.outcome}
                                onChange={(e) => setFormData({ ...formData, outcome: e.target.value })}
                            >
                                <option value="successful">Exitoso</option>
                                <option value="no_answer">Sin respuesta</option>
                                <option value="follow_up_needed">Requiere seguimiento</option>
                                <option value="not_interested">No interesado</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Duración (minutos)</label>
                            <input
                                type="number"
                                value={formData.duration_minutes}
                                onChange={(e) => setFormData({ ...formData, duration_minutes: e.target.value })}
                                placeholder="0"
                                min="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha y Hora</label>
                            <input
                                type="datetime-local"
                                value={formData.activity_date}
                                onChange={(e) => setFormData({ ...formData, activity_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            placeholder="Detalles de la actividad..."
                        />
                    </div>

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ActivityModal;
