import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    closestCorners
} from '@dnd-kit/core';
import {
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
    TrendingUp,
    DollarSign,
    Target,
    Filter,
    X,
    User
} from 'lucide-react';
import {
    getOpportunities,
    updateOpportunityStage,
    closeOpportunity
} from '../../services/crmService';
import './OpportunityPipeline.css';

// Sortable Card Component
const OpportunityCard = ({ opportunity, isDragging }) => {
    const navigate = useNavigate();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging: isSortableDragging
    } = useSortable({ id: opportunity.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isSortableDragging ? 0.5 : 1
    };

    const calculateDaysInStage = (updatedAt) => {
        const now = new Date();
        const updated = new Date(updatedAt);
        const diffTime = Math.abs(now - updated);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const daysInStage = calculateDaysInStage(opportunity.updated_at);

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className={`opportunity-card ${isDragging ? 'dragging' : ''}`}
            onClick={(e) => {
                if (!isDragging) {
                    navigate(`/crm/opportunities/${opportunity.id}`);
                }
            }}
        >
            <div className="card-header">
                <h4>{opportunity.customer_name || 'Sin cliente'}</h4>
                {opportunity.assigned_to_name && (
                    <div className="avatar-sm" title={opportunity.assigned_to_name}>
                        {opportunity.assigned_to_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </div>
                )}
            </div>

            <p className="card-title">{opportunity.title}</p>

            {opportunity.car_info && (
                <p className="card-car">{opportunity.car_info}</p>
            )}

            <div className="card-footer">
                <div className="card-value">
                    <DollarSign size={14} />
                    <span>{formatCurrency(opportunity.estimated_value)}</span>
                </div>
                {opportunity.probability && (
                    <span className="card-probability">{opportunity.probability}%</span>
                )}
            </div>

            <div className="card-meta">
                <span className="days-badge">{daysInStage}d en stage</span>
            </div>
        </div>
    );
};

// Stage Column Component
const StageColumn = ({ stage, opportunities, title, color }) => {
    const { setNodeRef } = useSortable({
        id: stage,
        data: { type: 'column' }
    });

    return (
        <div className="kanban-column" ref={setNodeRef}>
            <div className="column-header" style={{ borderTopColor: color }}>
                <h3>{title}</h3>
                <span className="count-badge">{opportunities.length}</span>
            </div>

            <SortableContext
                items={opportunities.map(opp => opp.id)}
                strategy={verticalListSortingStrategy}
            >
                <div className="column-content">
                    {opportunities.map((opp) => (
                        <OpportunityCard key={opp.id} opportunity={opp} />
                    ))}
                    {opportunities.length === 0 && (
                        <p className="empty-column">Sin oportunidades</p>
                    )}
                </div>
            </SortableContext>
        </div>
    );
};

const OpportunityPipeline = () => {
    const [opportunities, setOpportunities] = useState([]);
    const [filteredOpportunities, setFilteredOpportunities] = useState([]);
    const [stageGroups, setStageGroups] = useState({});
    const [loading, setLoading] = useState(true);
    const [activeId, setActiveId] = useState(null);

    // Filters
    const [filters, setFilters] = useState({
        assignedTo: 'all',
        source: 'all',
        minValue: 0,
        maxValue: 10000000
    });

    // Close Modal
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [opportunityToClose, setOpportunityToClose] = useState(null);
    const [closeData, setCloseData] = useState({
        stage: '',
        final_value: '',
        lost_reason: '',
        notes: ''
    });

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    const stages = [
        { id: 'new', title: 'Nuevo', color: '#3b82f6' },
        { id: 'contacted', title: 'Contactado', color: '#8b5cf6' },
        { id: 'qualified', title: 'Calificado', color: '#6366f1' },
        { id: 'proposal', title: 'Propuesta', color: '#ec4899' },
        { id: 'negotiation', title: 'Negociación', color: '#f59e0b' },
        { id: 'financing_approval', title: 'Aprobación Financ.', color: '#a855f7' },
        { id: 'closed_won', title: 'Ganado', color: '#10b981' },
        { id: 'closed_lost', title: 'Perdido', color: '#ef4444' }
    ];

    useEffect(() => {
        loadOpportunities();
    }, []);

    useEffect(() => {
        filterOpportunities();
    }, [opportunities, filters]);

    useEffect(() => {
        groupByStage();
    }, [filteredOpportunities]);

    const loadOpportunities = async () => {
        try {
            setLoading(true);
            const response = await getOpportunities();
            setOpportunities(response.data || []);
        } catch (error) {
            console.error('Error loading opportunities:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterOpportunities = () => {
        let filtered = [...opportunities];

        if (filters.assignedTo !== 'all') {
            filtered = filtered.filter(opp => opp.assigned_to === parseInt(filters.assignedTo));
        }

        if (filters.source !== 'all') {
            filtered = filtered.filter(opp => opp.source === filters.source);
        }

        filtered = filtered.filter(opp => {
            const value = opp.estimated_value || 0;
            return value >= filters.minValue && value <= filters.maxValue;
        });

        setFilteredOpportunities(filtered);
    };

    const groupByStage = () => {
        const groups = stages.reduce((acc, stage) => {
            acc[stage.id] = filteredOpportunities.filter(opp => opp.stage === stage.id);
            return acc;
        }, {});
        setStageGroups(groups);
    };

    const handleDragStart = (event) => {
        setActiveId(event.active.id);
    };

    const handleDragEnd = async (event) => {
        const { active, over } = event;
        setActiveId(null);

        if (!over) return;

        const opportunityId = active.id;
        const newStage = over.id;

        // Find the opportunity
        const opportunity = opportunities.find(opp => opp.id === opportunityId);
        if (!opportunity) return;

        // If dropped on same stage, do nothing
        if (opportunity.stage === newStage) return;

        // If dropped on closed_won or closed_lost, open modal
        if (newStage === 'closed_won' || newStage === 'closed_lost') {
            setOpportunityToClose({ ...opportunity, newStage });
            setCloseData({
                stage: newStage,
                final_value: opportunity.estimated_value || '',
                lost_reason: '',
                notes: ''
            });
            setIsCloseModalOpen(true);
            return;
        }

        // Otherwise, update stage directly
        try {
            await updateOpportunityStage(opportunityId, newStage);

            // Update local state
            setOpportunities(prev => prev.map(opp =>
                opp.id === opportunityId ? { ...opp, stage: newStage } : opp
            ));
        } catch (error) {
            console.error('Error updating stage:', error);
            alert('Error al actualizar el stage');
        }
    };

    const handleCloseOpportunity = async () => {
        if (!opportunityToClose) return;

        try {
            await closeOpportunity(opportunityToClose.id, {
                stage: closeData.stage,
                final_value: closeData.final_value,
                lost_reason: closeData.lost_reason,
                notes: closeData.notes
            });

            // Update local state
            setOpportunities(prev => prev.map(opp =>
                opp.id === opportunityToClose.id
                    ? { ...opp, stage: closeData.stage }
                    : opp
            ));

            setIsCloseModalOpen(false);
            setOpportunityToClose(null);
        } catch (error) {
            console.error('Error closing opportunity:', error);
            alert('Error al cerrar la oportunidad');
        }
    };

    const clearFilters = () => {
        setFilters({
            assignedTo: 'all',
            source: 'all',
            minValue: 0,
            maxValue: 10000000
        });
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    // Calculate metrics
    const totalValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.estimated_value || 0), 0);
    const weightedValue = filteredOpportunities.reduce((sum, opp) =>
        sum + ((opp.estimated_value || 0) * (opp.probability || 0) / 100), 0
    );

    const activeOpportunity = opportunities.find(opp => opp.id === activeId);

    if (loading) {
        return (
            <div className="pipeline-loading">
                <div className="spinner"></div>
                <p>Cargando pipeline...</p>
            </div>
        );
    }

    return (
        <div className="opportunity-pipeline">
            {/* Header */}
            <div className="pipeline-header">
                <h1>Pipeline de Ventas</h1>

                {/* Metrics */}
                <div className="metrics-bar">
                    <div className="metric-card">
                        <div className="metric-icon" style={{ backgroundColor: '#eff6ff' }}>
                            <Target size={20} color="#2563eb" />
                        </div>
                        <div className="metric-content">
                            <p className="metric-label">Oportunidades</p>
                            <p className="metric-value">{filteredOpportunities.length}</p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon" style={{ backgroundColor: '#fef3c7' }}>
                            <DollarSign size={20} color="#f59e0b" />
                        </div>
                        <div className="metric-content">
                            <p className="metric-label">Valor Total</p>
                            <p className="metric-value">{formatCurrency(totalValue)}</p>
                        </div>
                    </div>

                    <div className="metric-card">
                        <div className="metric-icon" style={{ backgroundColor: '#dcfce7' }}>
                            <TrendingUp size={20} color="#10b981" />
                        </div>
                        <div className="metric-content">
                            <p className="metric-label">Valor Ponderado</p>
                            <p className="metric-value">{formatCurrency(weightedValue)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filters-row">
                    <select
                        value={filters.assignedTo}
                        onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
                    >
                        <option value="all">Todos los vendedores</option>
                        {/* Add dynamic options from users */}
                    </select>

                    <select
                        value={filters.source}
                        onChange={(e) => setFilters({ ...filters, source: e.target.value })}
                    >
                        <option value="all">Todas las fuentes</option>
                        <option value="website">Website</option>
                        <option value="partner">Partner</option>
                        <option value="direct">Direct</option>
                        <option value="referral">Referral</option>
                        <option value="marketing">Marketing</option>
                    </select>

                    <div className="value-range">
                        <input
                            type="number"
                            placeholder="Valor mínimo"
                            value={filters.minValue}
                            onChange={(e) => setFilters({ ...filters, minValue: parseInt(e.target.value) || 0 })}
                        />
                        <span>-</span>
                        <input
                            type="number"
                            placeholder="Valor máximo"
                            value={filters.maxValue}
                            onChange={(e) => setFilters({ ...filters, maxValue: parseInt(e.target.value) || 10000000 })}
                        />
                    </div>

                    <button className="btn-clear" onClick={clearFilters}>
                        <X size={16} />
                        Limpiar Filtros
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-board">
                    {stages.map((stage) => (
                        <StageColumn
                            key={stage.id}
                            stage={stage.id}
                            title={stage.title}
                            color={stage.color}
                            opportunities={stageGroups[stage.id] || []}
                        />
                    ))}
                </div>

                <DragOverlay>
                    {activeId && activeOpportunity ? (
                        <OpportunityCard opportunity={activeOpportunity} isDragging />
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Close Modal */}
            {isCloseModalOpen && (
                <div className="modal-overlay" onClick={() => setIsCloseModalOpen(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <h2>Cerrar Oportunidad</h2>

                        <div className="modal-body">
                            <div className="form-group">
                                <label>Estado Final</label>
                                <input
                                    type="text"
                                    value={closeData.stage === 'closed_won' ? 'Ganado' : 'Perdido'}
                                    disabled
                                />
                            </div>

                            {closeData.stage === 'closed_won' && (
                                <div className="form-group">
                                    <label>Valor Final</label>
                                    <input
                                        type="number"
                                        value={closeData.final_value}
                                        onChange={(e) => setCloseData({ ...closeData, final_value: e.target.value })}
                                        placeholder="Valor final de la venta"
                                    />
                                </div>
                            )}

                            {closeData.stage === 'closed_lost' && (
                                <div className="form-group">
                                    <label>Razón de Pérdida</label>
                                    <select
                                        value={closeData.lost_reason}
                                        onChange={(e) => setCloseData({ ...closeData, lost_reason: e.target.value })}
                                    >
                                        <option value="">Seleccionar razón</option>
                                        <option value="price">Precio</option>
                                        <option value="financing">Financiamiento</option>
                                        <option value="competitor">Competidor</option>
                                        <option value="timing">Timing</option>
                                        <option value="no_response">Sin respuesta</option>
                                        <option value="other">Otro</option>
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Notas Adicionales</label>
                                <textarea
                                    value={closeData.notes}
                                    onChange={(e) => setCloseData({ ...closeData, notes: e.target.value })}
                                    placeholder="Detalles adicionales..."
                                    rows="4"
                                />
                            </div>
                        </div>

                        <div className="modal-actions">
                            <button className="btn-secondary" onClick={() => setIsCloseModalOpen(false)}>
                                Cancelar
                            </button>
                            <button className="btn-primary" onClick={handleCloseOpportunity}>
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OpportunityPipeline;
