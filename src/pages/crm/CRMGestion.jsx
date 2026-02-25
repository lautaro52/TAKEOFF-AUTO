import React, { useState, useEffect, useCallback } from 'react';
import { crmClients, crmNotes, crmTasks } from '../../services/crmService';
import { Plus, Search, Mail, Phone, MessageSquare, Clock, CheckCircle2, X, Loader2, UserPlus, Calendar, Trash2, User, Activity, Copy, Hash, Zap, ExternalLink, Filter } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import './CRM.css';

const stages = [
    { id: 'sin_gestionar', label: 'Sin Gestionar', color: '#64748b' },
    { id: 'primer_contacto', label: 'Primer Contacto', color: '#3b82f6' },
    { id: 'negociacion', label: 'En Programación de Cita', color: '#f59e0b' },
    { id: 'venta_realizada', label: 'Cita Pactada', color: '#10b981' }
];

const CRMGestion = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState({ description: '', due_date: '' });
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState('notes'); // 'notes' or 'tasks'
    const [pendingStage, setPendingStage] = useState('');

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const res = await crmClients.list();
            if (res.success) setClients(res.data || []);
        } catch (e) {
            console.error('Error fetching clients:', e);
        }
        setLoading(false);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const fetchClientDetails = async (client) => {
        setSelectedClient(client);
        setPendingStage(client.stage);
        try {
            const [nRes, tRes] = await Promise.all([
                crmNotes.list(client.id),
                crmTasks.list(client.id)
            ]);
            if (nRes.success) setNotes(nRes.data || []);
            if (tRes.success) setTasks(tRes.data || []);
        } catch (e) {
            console.error('Error fetching details:', e);
        }
    };

    const handleUpdateStage = async (clientId, newStage) => {
        try {
            const res = await crmClients.updateStage(clientId, newStage);
            if (res.success) {
                setClients(prev => prev.map(c => c.id === clientId ? { ...c, stage: newStage } : c));
                if (selectedClient?.id === clientId) {
                    setSelectedClient(prev => ({ ...prev, stage: newStage }));
                }
            }
        } catch (e) {
            console.error('Update stage error:', e);
        }
    };

    const handleRegisterManagement = async (e) => {
        e.preventDefault();
        if (!newNote.trim() || !newTask.description.trim() || !newTask.due_date) {
            alert('Por favor, completa la nota y define la próxima tarea (descripción, fecha y hora).');
            return;
        }

        setSaving(true);
        try {
            // Save Note
            const noteRes = await crmNotes.create({
                client_id: selectedClient.id,
                content: newNote
            });

            // Save Task
            const taskRes = await crmTasks.create({
                client_id: selectedClient.id,
                description: newTask.description,
                due_date: newTask.due_date
            });

            // Apply the stage change selected in the stepper
            if (pendingStage !== selectedClient.stage) {
                await crmClients.updateStage(selectedClient.id, pendingStage);
            }

            if (noteRes.success && taskRes.success) {
                // Refresh client list to move card in Kanban
                await fetchData();

                // Refresh details
                const [nRes, tRes] = await Promise.all([
                    crmNotes.list(selectedClient.id),
                    crmTasks.list(selectedClient.id)
                ]);
                if (nRes.success) setNotes(nRes.data || []);
                if (tRes.success) setTasks(tRes.data || []);

                // Update local selected client stage
                setSelectedClient(prev => ({ ...prev, stage: pendingStage }));

                // Reset form
                setNewNote('');
                setNewTask({ description: '', due_date: '' });
                alert(`✓ Gestión guardada. El lead ahora está en: ${stages.find(s => s.id === pendingStage)?.label}`);
            } else {
                alert('Error: ' + (noteRes.message || taskRes.message || 'No se pudo guardar la gestión.'));
            }
        } catch (e) {
            console.error('Error registering management:', e);
            alert('Error crítico de conexión al guardar.');
        }
        setSaving(false);
    };

    const handleCompleteTask = async (taskId) => {
        try {
            const res = await crmTasks.complete(taskId);
            if (res.success) {
                setTasks(prev => prev.map(t => t.id === taskId ? { ...t, completed: 1, completed_at: new Date().toISOString() } : t));
                setClients(prev => prev.map(c => c.id === selectedClient.id ? { ...c, tasks_pending: Math.max(0, (c.tasks_pending || 0) - 1) } : c));
            }
        } catch (e) {
            console.error('Complete task error:', e);
        }
    };

    const handleDeleteClient = async () => {
        if (!window.confirm('¿Seguro que desea eliminar este cliente?')) return;
        try {
            const res = await crmClients.remove(selectedClient.id);
            if (res.success) {
                setClients(prev => prev.filter(c => c.id !== selectedClient.id));
                setSelectedClient(null);
            }
        } catch (e) {
            console.error('Delete client error:', e);
        }
    };

    const filteredClients = clients.filter(c =>
        `${c.full_name} ${c.phone || c.whatsapp || ''} ${c.car_model || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr, includeTime = false) => {
        if (!dateStr) return '';
        const options = {
            day: '2-digit',
            month: 'short',
        };
        if (includeTime) {
            options.hour = '2-digit';
            options.minute = '2-digit';
        }
        return new Date(dateStr).toLocaleDateString('es-AR', options);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copiado al portapapeles');
    };

    if (loading && clients.length === 0) {
        return (
            <div className="crm-loading">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={32} />
                </motion.div>
                Cargando gestión...
            </div>
        );
    }

    return (
        <div className="crm-gestion">
            <div className="crm-page-header">
                <div>
                    <h1>Pipeline de Ventas</h1>
                    <p>Gestiona tus prospectos y ventas activas</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="crm-search">
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre, auto o contacto..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <button className="crm-btn crm-btn-primary" onClick={() => setShowAddModal(true)}>
                        <UserPlus size={18} />
                        Nuevo Lead
                    </button>
                </div>
            </div>

            <div className="crm-pipeline">
                <LayoutGroup>
                    {stages.map(stage => (
                        <div key={stage.id} className="crm-pipeline-col">
                            <div className="crm-pipeline-col-header">
                                <h3>{stage.label}</h3>
                                <span className="crm-pipeline-count">
                                    {filteredClients.filter(c => c.stage === stage.id).length}
                                </span>
                            </div>

                            <div className="crm-pipeline-items" style={{ minHeight: '100px' }}>
                                <AnimatePresence mode="popLayout">
                                    {filteredClients
                                        .filter(c => c.stage === stage.id)
                                        .map((client) => (
                                            <motion.div
                                                layout
                                                key={client.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="crm-client-card"
                                                onClick={() => fetchClientDetails(client)}
                                            >
                                                <h4>{client.full_name}</h4>
                                                <div className="client-phone">
                                                    <MessageSquare size={14} /> {client.phone || client.whatsapp || 'Sin número'}
                                                </div>
                                                {client.car_model && (
                                                    <div className="client-car">
                                                        🚗 {client.car_brand} {client.car_model}
                                                    </div>
                                                )}
                                                {client.last_note && (
                                                    <p className="client-note-preview">{client.last_note}</p>
                                                )}
                                                <div className="client-meta">
                                                    <span><Clock size={12} /> {new Date(client.created_at).toLocaleDateString()}</span>
                                                    {client.tasks_pending > 0 && (
                                                        <span style={{ color: '#f59e0b' }}><CheckCircle2 size={12} /> {client.tasks_pending}</span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    ))}
                </LayoutGroup>
            </div>

            {/* Client Detail Drawer */}
            <AnimatePresence>
                {selectedClient && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="crm-drawer-overlay"
                            onClick={() => setSelectedClient(null)}
                        />
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="crm-drawer"
                        >
                            <button className="crm-drawer-close-btn" onClick={() => setSelectedClient(null)}>
                                <X size={24} />
                            </button>
                            <div className="crm-drawer-body">
                                {/* Hero Section */}
                                <div className="crm-client-hero">
                                    <div className="crm-client-avatar">
                                        <User size={32} />
                                    </div>
                                    <div className="crm-client-details">
                                        <div className="crm-hero-name">
                                            <h2>{selectedClient.full_name}</h2>
                                            <span className={`crm-status-pill ${pendingStage}`}>
                                                {stages.find(s => s.id === pendingStage)?.label}
                                            </span>
                                        </div>
                                        <div className="crm-hero-meta">
                                            <span><Clock size={14} /> Lead desde {new Date(selectedClient.created_at).toLocaleDateString()}</span>
                                            {selectedClient.email && (
                                                <span onClick={() => copyToClipboard(selectedClient.email)} title="Copiar email">
                                                    <Mail size={14} /> {selectedClient.email}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="crm-client-stats-bar">
                                    <div className="stat-item">
                                        <span className="label">Actividad</span>
                                        <span className="value">{notes.length + tasks.length}</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Asignado</span>
                                        <span className="value">Admin</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="label">Prioridad</span>
                                        <span className="value high"><Zap size={14} /> Alta</span>
                                    </div>
                                </div>

                                <div className="crm-contact-grid">
                                    {(selectedClient.phone || selectedClient.whatsapp) ? (
                                        <>
                                            <a href={`https://wa.me/${(selectedClient.phone || selectedClient.whatsapp).replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="crm-contact-card whatsapp">
                                                <div className="icon"><MessageSquare size={18} /></div>
                                                <div className="info">
                                                    <strong>WhatsApp</strong>
                                                    <span>{selectedClient.phone || selectedClient.whatsapp}</span>
                                                </div>
                                                <ExternalLink size={14} className="ext" />
                                            </a>
                                            <a href={`tel:${selectedClient.phone || selectedClient.whatsapp}`} className="crm-contact-card phone">
                                                <div className="icon"><Phone size={18} /></div>
                                                <div className="info">
                                                    <strong>Llamar</strong>
                                                    <span>Vía celular</span>
                                                </div>
                                                <ExternalLink size={14} className="ext" />
                                            </a>
                                        </>
                                    ) : (
                                        <div className="crm-contact-card disabled" style={{ gridColumn: 'span 2', opacity: 0.5 }}>
                                            <div className="icon"><Phone size={18} /></div>
                                            <div className="info">
                                                <strong>Sin contacto</strong>
                                                <span>No hay teléfono registrado</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="crm-grid-details">
                                    {selectedClient.car_model && (
                                        <div className="crm-detail-tile">
                                            <div className="tile-header"><Activity size={16} /> Interés de compra</div>
                                            <div className="tile-body car">
                                                <div className="car-tag">Oportunidad</div>
                                                <h4>{selectedClient.car_brand} {selectedClient.car_model}</h4>
                                                <p>Año {selectedClient.car_year || 'N/A'} • ${Number(selectedClient.car_price || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    )}
                                    <div className="crm-detail-tile">
                                        <div className="tile-header"><Hash size={16} /> Datos de contacto</div>
                                        <div className="tile-body data">
                                            <div className="data-row">
                                                <label>ID Lead</label>
                                                <span>#{selectedClient.id}</span>
                                            </div>
                                            <div className="data-row">
                                                <label>Origen</label>
                                                <span>Web Oficial</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="crm-drawer-section stage-section">
                                    <h3>Cambiar Etapa del Pipeline</h3>
                                    <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: 12 }}>
                                        El cambio se confirmará al registrar la gestión.
                                    </p>
                                    <div className="crm-stage-stepper">
                                        {stages.map((s, idx) => (
                                            <React.Fragment key={s.id}>
                                                <button
                                                    className={`crm-stepper-btn ${pendingStage === s.id ? 'active' : ''}`}
                                                    onClick={() => setPendingStage(s.id)}
                                                >
                                                    <div className="dot"></div>
                                                    <span>{s.label}</span>
                                                </button>
                                                {idx < stages.length - 1 && <div className="stepper-line"></div>}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>

                                <div className="crm-drawer-section activities-section">
                                    <div className="crm-tab-header">
                                        <button className={`crm-tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
                                            <Zap size={16} /> Nueva Gestión (Nota + Tarea)
                                        </button>
                                        <button className={`crm-tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>
                                            <Calendar size={16} /> Historial y Pendientes
                                        </button>
                                    </div>

                                    {activeTab === 'notes' ? (
                                        <>
                                            <form onSubmit={handleRegisterManagement} className="crm-unified-management-form">
                                                <div className="form-section">
                                                    <label><MessageSquare size={14} /> Nota de la Gestión</label>
                                                    <textarea
                                                        placeholder="Describe qué hablaste con el cliente..."
                                                        value={newNote}
                                                        onChange={(e) => setNewNote(e.target.value)}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-section task-required">
                                                    <label><Calendar size={14} /> Próxima Tarea Obligatoria</label>
                                                    <div className="task-inputs">
                                                        <input
                                                            type="text"
                                                            placeholder="¿Qué debe hacer el agente IA a continuación?"
                                                            value={newTask.description}
                                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                                            required
                                                        />
                                                        <div className="input-with-icon">
                                                            <Clock size={16} />
                                                            <input
                                                                type="datetime-local"
                                                                value={newTask.due_date}
                                                                onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <button type="submit" disabled={saving} className="crm-btn crm-btn-primary full-width">
                                                    {saving ? <Loader2 size={18} className="crm-spinner" /> : <Plus size={18} />}
                                                    Registrar Gestión y Próxima Tarea
                                                </button>
                                            </form>

                                            <div className="crm-feed-timeline">
                                                <h3>Feed de Actividad Reciente</h3>
                                                {notes.map(note => (
                                                    <div key={note.id} className="crm-feed-item">
                                                        <div className="feed-connector"></div>
                                                        <div className="feed-icon"><Activity size={14} /></div>
                                                        <div className="feed-content">
                                                            <div className="feed-header">
                                                                <strong>{note.admin_name || 'Admin'}</strong>
                                                                <span>{formatDate(note.created_at, true)}</span>
                                                            </div>
                                                            <p>{note.content}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {notes.length === 0 && (
                                                    <div className="crm-empty-feed">
                                                        <Activity size={32} />
                                                        <p>No hay actividad registrada aún.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="crm-premium-tasks-list">
                                                <h3>Tareas Agendadas</h3>
                                                {tasks.map(task => (
                                                    <div key={task.id} className={`crm-task-card ${Number(task.completed) ? 'completed' : ''}`}>
                                                        <div className="task-indicator"></div>
                                                        <div className="task-main">
                                                            <div className="task-header">
                                                                <p>{task.description}</p>
                                                                {!Number(task.completed) && (
                                                                    <button
                                                                        className="task-check-btn"
                                                                        onClick={() => handleCompleteTask(task.id)}
                                                                        title="Marcar completada"
                                                                    >
                                                                        <CheckCircle2 size={18} />
                                                                    </button>
                                                                )}
                                                                {Number(task.completed) && <CheckCircle2 size={18} className="done-icon" />}
                                                            </div>
                                                            <div className="task-footer">
                                                                <span className={`task-deadline ${new Date(task.due_date) < new Date() && !Number(task.completed) ? 'overdue' : ''}`}>
                                                                    <Clock size={12} />
                                                                    {task.due_date ? formatDate(task.due_date, true) : 'Sin horario'}
                                                                </span>
                                                                {Number(task.completed) && <span className="completed-label">Completada</span>}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                {tasks.length === 0 && (
                                                    <div className="crm-empty-feed">
                                                        <Calendar size={32} />
                                                        <p>Agenda libre de tareas.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Add Client Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <div className="crm-modal-overlay">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="crm-modal"
                        >
                            <h2>Crear Nuevo Lead</h2>
                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                setSaving(true);
                                const formData = new FormData(e.target);
                                try {
                                    const res = await crmClients.create(Object.fromEntries(formData));
                                    if (res.success) {
                                        setClients(prev => [res.data, ...prev]);
                                        setShowAddModal(false);
                                    }
                                } catch (e) {
                                    console.error('Create error:', e);
                                }
                                setSaving(false);
                            }}>
                                <div className="crm-form-group">
                                    <label>Nombre Completo *</label>
                                    <input name="full_name" required placeholder="Ej: Roberto Sánchez" />
                                </div>
                                <div className="crm-form-group">
                                    <label>WhatsApp / Teléfono *</label>
                                    <input name="phone" required placeholder="Ej: 3512345678" />
                                </div>
                                <div className="crm-form-group">
                                    <label>Email (Opcional)</label>
                                    <input name="email" type="email" placeholder="roberto@correo.com" />
                                </div>
                                <div className="crm-form-group">
                                    <label>Auto de Interés</label>
                                    <input name="car_id" placeholder="ID o modelo" />
                                </div>
                                <div className="crm-form-actions">
                                    <button type="button" className="crm-btn crm-btn-secondary" onClick={() => setShowAddModal(false)}>Cancelar</button>
                                    <button type="submit" disabled={saving} className="crm-btn crm-btn-primary">
                                        {saving ? <Loader2 size={16} className="crm-spinner" /> : 'Guardar Lead'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default CRMGestion;
