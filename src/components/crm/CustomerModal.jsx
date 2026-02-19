import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createCustomer, updateCustomer, getCustomerById } from '../../services/crmService';
import './CRMModals.css';

const CustomerModal = ({ isOpen, onClose, customerId, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        whatsapp: '',
        city: '',
        address: '',
        dni: '',
        birth_date: '',
        customer_type: 'buyer',
        source: 'website',
        status: 'lead',
        preferred_contact_method: 'whatsapp',
        marketing_consent: false,
        notes: ''
    });

    useEffect(() => {
        if (isOpen && customerId) {
            loadCustomer();
        } else if (isOpen && !customerId) {
            resetForm();
        }
    }, [isOpen, customerId]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const loadCustomer = async () => {
        try {
            const response = await getCustomerById(customerId);
            setFormData(response.data);
        } catch (error) {
            console.error('Error loading customer:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            full_name: '',
            email: '',
            phone: '',
            whatsapp: '',
            city: '',
            address: '',
            dni: '',
            birth_date: '',
            customer_type: 'buyer',
            source: 'website',
            status: 'lead',
            preferred_contact_method: 'whatsapp',
            marketing_consent: false,
            notes: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.full_name.trim()) {
            newErrors.full_name = 'El nombre es requerido';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'El teléfono es requerido';
        }

        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email inválido';
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

            if (customerId) {
                await updateCustomer(customerId, formData);
            } else {
                await createCustomer(formData);
            }

            if (onSave) {
                onSave();
            }
            onClose();
        } catch (error) {
            console.error('Error saving customer:', error);
            alert('Error al guardar el cliente');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{customerId ? 'Editar Cliente' : 'Nuevo Cliente'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Nombre Completo *</label>
                            <input
                                type="text"
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                className={errors.full_name ? 'error' : ''}
                            />
                            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className={errors.email ? 'error' : ''}
                            />
                            {errors.email && <span className="error-message">{errors.email}</span>}
                        </div>

                        <div className="form-group">
                            <label>Teléfono *</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+54 9 11 1234-5678"
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>

                        <div className="form-group">
                            <label>WhatsApp</label>
                            <input
                                type="tel"
                                value={formData.whatsapp}
                                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                placeholder="+54 9 11 1234-5678"
                            />
                        </div>

                        <div className="form-group">
                            <label>Ciudad</label>
                            <input
                                type="text"
                                value={formData.city}
                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Dirección</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>DNI</label>
                            <input
                                type="text"
                                value={formData.dni}
                                onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                                placeholder="12345678"
                            />
                        </div>

                        <div className="form-group">
                            <label>Fecha de Nacimiento</label>
                            <input
                                type="date"
                                value={formData.birth_date}
                                onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                            />
                        </div>

                        <div className="form-group">
                            <label>Fuente</label>
                            <select
                                value={formData.source}
                                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                            >
                                <option value="website">Website</option>
                                <option value="partner">Partner</option>
                                <option value="direct">Direct</option>
                                <option value="referral">Referral</option>
                                <option value="marketing">Marketing</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="lead">Lead</option>
                                <option value="prospect">Prospect</option>
                                <option value="customer">Customer</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Método de Contacto Preferido</label>
                            <select
                                value={formData.preferred_contact_method}
                                onChange={(e) => setFormData({ ...formData, preferred_contact_method: e.target.value })}
                            >
                                <option value="phone">Teléfono</option>
                                <option value="whatsapp">WhatsApp</option>
                                <option value="email">Email</option>
                                <option value="sms">SMS</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Tipo de Cliente</label>
                        <div className="radio-group">
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="buyer"
                                    checked={formData.customer_type === 'buyer'}
                                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                                />
                                Comprador
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="seller"
                                    checked={formData.customer_type === 'seller'}
                                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                                />
                                Vendedor
                            </label>
                            <label className="radio-label">
                                <input
                                    type="radio"
                                    value="both"
                                    checked={formData.customer_type === 'both'}
                                    onChange={(e) => setFormData({ ...formData, customer_type: e.target.value })}
                                />
                                Ambos
                            </label>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={formData.marketing_consent}
                                onChange={(e) => setFormData({ ...formData, marketing_consent: e.target.checked })}
                            />
                            Acepta recibir comunicaciones de marketing
                        </label>
                    </div>

                    <div className="form-group">
                        <label>Notas</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="4"
                            placeholder="Información adicional..."
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

export default CustomerModal;
