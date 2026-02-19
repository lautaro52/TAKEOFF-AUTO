import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Phone,
    Mail,
    MapPin,
    MessageCircle,
    Edit,
    Trash2,
    ArrowLeft,
    Plus,
    CheckCircle2,
    Clock,
    Car
} from 'lucide-react';
import {
    getCustomerById,
    updateCustomer,
    deleteCustomer,
    getCustomerActivities,
    getTasks
} from '../../services/crmService';
import { getOpportunities } from '../../services/crmService';
import './CustomerDetail.css';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [customer, setCustomer] = useState(null);
    const [opportunities, setOpportunities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('info');
    const [isEditing, setIsEditing] = useState(false);
    const [editedCustomer, setEditedCustomer] = useState(null);

    useEffect(() => {
        loadCustomerData();
    }, [id]);

    const loadCustomerData = async () => {
        try {
            setLoading(true);

            // Load customer
            const customerRes = await getCustomerById(id);
            setCustomer(customerRes.data);
            setEditedCustomer(customerRes.data);

            // Load opportunities
            const oppsRes = await getOpportunities({ customer_id: id });
            setOpportunities(oppsRes.data || []);

            // Load activities
            const activitiesRes = await getCustomerActivities(id, 50);
            setActivities(activitiesRes.data || []);

            // Load tasks
            const tasksRes = await getTasks({ customer_id: id });
            setTasks(tasksRes.data || []);

        } catch (error) {
            console.error('Error loading customer data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await updateCustomer(id, editedCustomer);
            setCustomer(editedCustomer);
            setIsEditing(false);
            alert('Cliente actualizado exitosamente');
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Error al actualizar el cliente');
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`¿Estás seguro de eliminar a "${customer.full_name}"?`)) {
            try {
                await deleteCustomer(id);
                navigate('/crm/customers');
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error al eliminar el cliente');
            }
        }
    };

    const getSourceBadge = (source) => {
        const colors = {
            website: '#4285F4',
            partner: '#EA4335',
            direct: '#9AA0A6',
            referral: '#FBBC04',
            marketing: '#34A853'
        };
        return (
            <span
                className="source-badge"
                style={{ backgroundColor: colors[source] || '#9AA0A6' }}
            >
                {source}
            </span>
        );
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={16} />;
            case 'email': return <Mail size={16} />;
            case 'whatsapp': return <MessageCircle size={16} />;
            default: return <MessageCircle size={16} />;
        }
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffHours / 24);

        if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
        if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
        return 'hace un momento';
    };

    if (loading) {
        return (
            <div className="customer-detail-loading">
                <div className="spinner"></div>
                <p>Cargando cliente...</p>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="customer-not-found">
                <p>Cliente no encontrado</p>
                <button onClick={() => navigate('/crm/customers')}>Volver a clientes</button>
            </div>
        );
    }

    return (
        <div className="customer-detail">
            {/* Header */}
            <div className="detail-header">
                <button className="btn-back" onClick={() => navigate('/crm/customers')}>
                    <ArrowLeft size={18} />
                    Volver
                </button>

                <div className="header-content">
                    <div className="header-left">
                        <h1>{customer.full_name}</h1>
                        {getSourceBadge(customer.source)}
                    </div>

                    <div className="header-actions">
                        {customer.whatsapp && (
                            <a
                                href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn-action btn-whatsapp"
                            >
                                <MessageCircle size={18} />
                                WhatsApp
                            </a>
                        )}
                        {customer.phone && (
                            <a
                                href={`tel:${customer.phone}`}
                                className="btn-action"
                            >
                                <Phone size={18} />
                                Llamar
                            </a>
                        )}
                        <button className="btn-action" onClick={() => setIsEditing(!isEditing)}>
                            <Edit size={18} />
                            Editar
                        </button>
                        <button className="btn-action btn-danger" onClick={handleDelete}>
                            <Trash2 size={18} />
                            Eliminar
                        </button>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="detail-content">
                {/* Sidebar */}
                <aside className="detail-sidebar">
                    {/* Contact Info */}
                    <div className="sidebar-card">
                        <h3>Información de Contacto</h3>
                        <div className="contact-info">
                            {customer.phone && (
                                <div className="info-item">
                                    <Phone size={16} />
                                    <span>{customer.phone}</span>
                                </div>
                            )}
                            {customer.email && (
                                <div className="info-item">
                                    <Mail size={16} />
                                    <span>{customer.email}</span>
                                </div>
                            )}
                            {customer.city && (
                                <div className="info-item">
                                    <MapPin size={16} />
                                    <span>{customer.city}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Related Cars */}
                    <div className="sidebar-card">
                        <h3>Vehículos de Interés</h3>
                        {opportunities.filter(opp => opp.car_info).length > 0 ? (
                            <div className="related-cars">
                                {opportunities
                                    .filter(opp => opp.car_info)
                                    .slice(0, 3)
                                    .map((opp, index) => (
                                        <div key={index} className="car-item">
                                            <Car size={16} />
                                            <span>{opp.car_info}</span>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="no-data">Sin vehículos de interés</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="sidebar-card">
                        <h3>Estadísticas</h3>
                        <div className="stats-grid">
                            <div className="stat-item">
                                <span className="stat-value">{opportunities.length}</span>
                                <span className="stat-label">Oportunidades</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{activities.length}</span>
                                <span className="stat-label">Actividades</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{tasks.filter(t => t.status === 'pending').length}</span>
                                <span className="stat-label">Tareas Pendientes</span>
                            </div>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="detail-main">
                    {/* Tabs */}
                    <div className="tabs">
                        <button
                            className={`tab ${activeTab === 'info' ? 'active' : ''}`}
                            onClick={() => setActiveTab('info')}
                        >
                            Información General
                        </button>
                        <button
                            className={`tab ${activeTab === 'opportunities' ? 'active' : ''}`}
                            onClick={() => setActiveTab('opportunities')}
                        >
                            Oportunidades ({opportunities.length})
                        </button>
                        <button
                            className={`tab ${activeTab === 'activities' ? 'active' : ''}`}
                            onClick={() => setActiveTab('activities')}
                        >
                            Timeline ({activities.length})
                        </button>
                        <button
                            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
                            onClick={() => setActiveTab('tasks')}
                        >
                            Tareas ({tasks.length})
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="tab-content">
                        {/* Info Tab */}
                        {activeTab === 'info' && (
                            <div className="info-form">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Nombre Completo</label>
                                        <input
                                            type="text"
                                            value={editedCustomer.full_name}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, full_name: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            value={editedCustomer.email || ''}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, email: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Teléfono</label>
                                        <input
                                            type="text"
                                            value={editedCustomer.phone || ''}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, phone: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>WhatsApp</label>
                                        <input
                                            type="text"
                                            value={editedCustomer.whatsapp || ''}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, whatsapp: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Ciudad</label>
                                        <input
                                            type="text"
                                            value={editedCustomer.city || ''}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, city: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Dirección</label>
                                        <input
                                            type="text"
                                            value={editedCustomer.address || ''}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, address: e.target.value })}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Tipo de Cliente</label>
                                        <select
                                            value={editedCustomer.customer_type}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, customer_type: e.target.value })}
                                            disabled={!isEditing}
                                        >
                                            <option value="buyer">Comprador</option>
                                            <option value="seller">Vendedor</option>
                                            <option value="both">Ambos</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select
                                            value={editedCustomer.status}
                                            onChange={(e) => setEditedCustomer({ ...editedCustomer, status: e.target.value })}
                                            disabled={!isEditing}
                                        >
                                            <option value="lead">Lead</option>
                                            <option value="prospect">Prospect</option>
                                            <option value="customer">Customer</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="form-actions">
                                        <button className="btn-primary" onClick={handleSave}>
                                            Guardar Cambios
                                        </button>
                                        <button className="btn-secondary" onClick={() => {
                                            setEditedCustomer(customer);
                                            setIsEditing(false);
                                        }}>
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Opportunities Tab */}
                        {activeTab === 'opportunities' && (
                            <div className="opportunities-tab">
                                <div className="tab-header">
                                    <h3>Oportunidades</h3>
                                    <button className="btn-primary btn-sm">
                                        <Plus size={16} />
                                        Nueva Oportunidad
                                    </button>
                                </div>

                                {opportunities.length > 0 ? (
                                    <table className="data-table">
                                        <thead>
                                            <tr>
                                                <th>Título</th>
                                                <th>Vehículo</th>
                                                <th>Stage</th>
                                                <th>Valor</th>
                                                <th>Fecha</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {opportunities.map((opp) => (
                                                <tr key={opp.id} onClick={() => navigate(`/crm/opportunities/${opp.id}`)}>
                                                    <td>{opp.title}</td>
                                                    <td>{opp.car_info || '-'}</td>
                                                    <td>
                                                        <span className={`stage-badge stage-${opp.stage}`}>
                                                            {opp.stage}
                                                        </span>
                                                    </td>
                                                    <td>${opp.estimated_value?.toLocaleString() || '0'}</td>
                                                    <td>{new Date(opp.created_at).toLocaleDateString('es-AR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <p className="no-data">No hay oportunidades registradas</p>
                                )}
                            </div>
                        )}

                        {/* Activities Tab */}
                        {activeTab === 'activities' && (
                            <div className="activities-tab">
                                <div className="tab-header">
                                    <h3>Timeline de Actividades</h3>
                                    <button className="btn-primary btn-sm">
                                        <Plus size={16} />
                                        Registrar Actividad
                                    </button>
                                </div>

                                {activities.length > 0 ? (
                                    <div className="timeline">
                                        {activities.map((activity) => (
                                            <div key={activity.id} className="timeline-item">
                                                <div className="timeline-icon">
                                                    {getActivityIcon(activity.activity_type)}
                                                </div>
                                                <div className="timeline-content">
                                                    <p className="timeline-subject">{activity.subject}</p>
                                                    {activity.description && (
                                                        <p className="timeline-description">{activity.description}</p>
                                                    )}
                                                    <p className="timeline-meta">
                                                        {activity.created_by_name} • {getTimeAgo(activity.created_at)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data">No hay actividades registradas</p>
                                )}
                            </div>
                        )}

                        {/* Tasks Tab */}
                        {activeTab === 'tasks' && (
                            <div className="tasks-tab">
                                <div className="tab-header">
                                    <h3>Tareas</h3>
                                    <button className="btn-primary btn-sm">
                                        <Plus size={16} />
                                        Nueva Tarea
                                    </button>
                                </div>

                                {tasks.length > 0 ? (
                                    <div className="tasks-list">
                                        {tasks.map((task) => (
                                            <div key={task.id} className="task-item">
                                                <input
                                                    type="checkbox"
                                                    checked={task.status === 'completed'}
                                                    onChange={() => {/* Handle complete */ }}
                                                />
                                                <div className="task-content">
                                                    <p className="task-title">{task.title}</p>
                                                    <div className="task-meta">
                                                        <Clock size={14} />
                                                        <span>{new Date(task.due_date).toLocaleDateString('es-AR')}</span>
                                                        <span className={`priority-badge priority-${task.priority}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="no-data">No hay tareas registradas</p>
                                )}
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CustomerDetail;
