import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { createTask, updateTask, getTaskById } from '../../services/crmService';
import './CRMModals.css';

const TaskModal = ({ isOpen, onClose, taskId, customerId, opportunityId, onSave }) => {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        customer_id: customerId || '',
        opportunity_id: opportunityId || '',
        title: '',
        description: '',
        task_type: 'call',
        priority: 'medium',
        due_date: '',
        assigned_to: '',
        reminder_date: ''
    });

    useEffect(() => {
        if (isOpen && taskId) {
            loadTask();
        } else if (isOpen && !taskId) {
            resetForm();
        }
    }, [isOpen, taskId]);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    const loadTask = async () => {
        try {
            const response = await getTaskById(taskId);
            setFormData(response.data);
        } catch (error) {
            console.error('Error loading task:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            customer_id: customerId || '',
            opportunity_id: opportunityId || '',
            title: '',
            description: '',
            task_type: 'call',
            priority: 'medium',
            due_date: '',
            assigned_to: '',
            reminder_date: ''
        });
        setErrors({});
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'El título es requerido';
        }

        if (!formData.due_date) {
            newErrors.due_date = 'La fecha de vencimiento es requerida';
        } else {
            const dueDate = new Date(formData.due_date);
            const now = new Date();
            if (dueDate < now && !taskId) {
                newErrors.due_date = 'La fecha no puede ser en el pasado';
            }
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

            if (taskId) {
                await updateTask(taskId, formData);
            } else {
                await createTask(formData);
            }

            if (onSave) {
                onSave();
            }
            onClose();
        } catch (error) {
            console.error('Error saving task:', error);
            alert('Error al guardar la tarea');
        } finally {
            setLoading(false);
        }
    };

    const getPriorityColor = (priority) => {
        const colors = {
            low: '#10b981',
            medium: '#f59e0b',
            high: '#f97316',
            urgent: '#ef4444'
        };
        return colors[priority] || colors.medium;
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>{taskId ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
                    <button className="modal-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group">
                        <label>Título *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={errors.title ? 'error' : ''}
                            placeholder="Ej: Llamar al cliente para seguimiento"
                        />
                        {errors.title && <span className="error-message">{errors.title}</span>}
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>Tipo</label>
                            <select
                                value={formData.task_type}
                                onChange={(e) => setFormData({ ...formData, task_type: e.target.value })}
                            >
                                <option value="call">Llamada</option>
                                <option value="email">Email</option>
                                <option value="meeting">Reunión</option>
                                <option value="follow_up">Seguimiento</option>
                                <option value="document">Documento</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Fecha de Vencimiento *</label>
                            <input
                                type="datetime-local"
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                className={errors.due_date ? 'error' : ''}
                            />
                            {errors.due_date && <span className="error-message">{errors.due_date}</span>}
                        </div>

                        <div className="form-group">
                            <label>Recordatorio</label>
                            <input
                                type="datetime-local"
                                value={formData.reminder_date}
                                onChange={(e) => setFormData({ ...formData, reminder_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Prioridad</label>
                        <div className="priority-grid">
                            {[
                                { value: 'low', label: 'Baja' },
                                { value: 'medium', label: 'Media' },
                                { value: 'high', label: 'Alta' },
                                { value: 'urgent', label: 'Urgente' }
                            ].map((priority) => (
                                <label
                                    key={priority.value}
                                    className={`priority-option ${formData.priority === priority.value ? 'active' : ''}`}
                                    style={{
                                        borderColor: formData.priority === priority.value ? getPriorityColor(priority.value) : '#d1d5db',
                                        backgroundColor: formData.priority === priority.value ? `${getPriorityColor(priority.value)}15` : 'white'
                                    }}
                                >
                                    <input
                                        type="radio"
                                        value={priority.value}
                                        checked={formData.priority === priority.value}
                                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                    />
                                    <span style={{ color: getPriorityColor(priority.value) }}>
                                        {priority.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Descripción</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="4"
                            placeholder="Detalles de la tarea..."
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

export default TaskModal;
