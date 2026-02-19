import React, { useState, useEffect } from 'react';
import { X, DollarSign } from 'lucide-react';
import {
    createOpportunity,
    updateOpportunity,
    getOpportunityById
} from '../../services/crmService';
import './CRMModals.css';

const OpportunityModal = ({ isOpen, onClose, customerId, opportunityId, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customer_id: customerId || '',
        title: '',
        description: '',
        opportunity_type: 'purchase',
        car_id: '',
        stage: 'new',
        estimated_value: '',
        probability: 50,
        expected_close_date: '',
        assigned_to: '',
        notes: ''
    });

    const [weightedValue, setWeightedValue] = useState(0);

    useEffect(() => {
        if (isOpen && opportunityId) {
            loadOpportunity();
        } else if (isOpen && !opportunityId) {
            resetForm();
        }
    }, [isOpen, opportunityId]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    useEffect(() => {
        // Calculate weighted value
        const value = parseFloat(formData.estimated_value) || 0;
        const prob = parseFloat(formData.probability) || 0;
        setWeightedValue((value * prob) / 100);
    }, [formData.estimated_value, formData.probability]);

    const loadOpportunity = async () => {
        try {
            const response = await getOpportunityById(opportunityId);
            setFormData(response.data);
        } catch (error) {
            console.error('Error loading opportunity:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            customer_id: customerId || '',
            title: '',
            description: '',
            opportunity_type: 'purchase',
            car_id: '',
            stage: 'new',
            estimated_value: '',
            probability: 50,
            expected_close_date: '',
            assigned_to: '',
            notes: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
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

            if (opportunityId) {
                await updateOpportunity(opportunityId, formData);
            } else {
                await createOpportunity(formData);
            }

            if (onSave) {
                onSave();
            }
            onClose();
        } catch (error) {
            console.error('Error saving opportunity:', error);
            alert('Error al guardar la oportunidad');
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{opportunityId ? 'Editar Oportunidad' : 'Nueva Oportunidad'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group full-width">
                            <label>Título *</label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className={errors.title ? 'error' : ''}
                                placeholder="Ej: Compra de Toyota Corolla 2020"
                            />
                            {errors.title && <span className="error-message">{errors.title}</span>}
                        </div>

                        <div className="form-group">
                            <label>Tipo</label>
                            <select
                                value={formData.opportunity_type}
                                onChange={(e) => setFormData({ ...formData, opportunity_type: e.target.value })}
                            >
                                <option value="purchase">Compra</option>
                                <option value="sale">Venta</option>
                                <option value="financing">Financiamiento</option>
                                <option value="trade_in">Permuta</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Stage</label>
                            <select
                                value={formData.stage}
                                onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                            >
                                <option value="new">Nuevo</option>
                                <option value="contacted">Contactado</option>
                                <option value="qualified">Calificado</option>
                                <option value="proposal">Propuesta</option>
                                <option value="negotiation">Negociación</option>
                                <option value="financing_approval">Aprobación Financ.</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Valor Estimado</label>
                            <input
                                type="number"
                                value={formData.estimated_value}
                                onChange={(e) => setFormData({ ...formData, estimated_value: e.target.value })}
                                placeholder="0"
                            />
                        </div>

                        <div className="form-group">
                            <label>Probabilidad (%)</label>
                            <div className="slider-container">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={formData.probability}
                                    onChange={(e) => setFormData({ ...formData, probability: e.target.value })}
                                />
                                <span className="slider-value">{formData.probability}%</span>
                            </div>
                        </div>

                        {formData.estimated_value && (
                            <div className="form-group full-width">
                                <div className="weighted-value">
                                    <DollarSign size={16} />
                                    <span>Valor Ponderado: {formatCurrency(weightedValue)}</span>
                                </div>
                            </div>
                        )}

                        <div className="form-group">
                            <label>Fecha Esperada de Cierre</label>
                            <input
                                type="date"
                                value={formData.expected_close_date}
                                onChange={(e) => setFormData({ ...formData, expected_close_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                            placeholder="Detalles de la oportunidad..."
                        />
                    </div>

                    <div className="form-group">
                        <label>Notas</label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            rows="3"
                            placeholder="Notas adicionales..."
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

export default OpportunityModal;
