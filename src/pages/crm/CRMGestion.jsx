import React, { useState, useEffect, useCallback } from 'react';
import { crmClients, crmNotes, crmTasks } from '../../services/crmService';
import { Plus, Search, X, Phone, MessageCircle, Mail, FileText, Clock, CheckCircle, Loader2, Users } from 'lucide-react';
import './CRM.css';

const STAGES = [
    { key: 'sin_gestionar', label: 'Sin Gestionar', emoji: '📋' },
    { key: 'primer_contacto', label: 'Primer Contacto', emoji: '📞' },
    { key: 'negociacion', label: 'Negociación', emoji: '🤝' },
    { key: 'venta_realizada', label: 'Venta Realizada', emoji: '✅' },
];

const CRMGestion = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedClient, setSelectedClient] = useState(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [drawerNotes, setDrawerNotes] = useState([]);
    const [drawerTasks, setDrawerTasks] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [newTask, setNewTask] = useState({ description: '', due_date: '' });
    const [saving, setSaving] = useState(false);

    // New client form
    const [newClient, setNewClient] = useState({ full_name: '', phone: '', email: '', dni: '', source: 'manual' });

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            const res = await crmClients.list(null, search || null);
            if (res.success) setClients(res.data || []);
        } catch (e) { console.error(e); }
        setLoading(false);
    }, [search]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    // Debounced search
    useEffect(() => {
        const timeout = setTimeout(fetchClients, 400);
        return () => clearTimeout(timeout);
    }, [search]);

    const getClientsByStage = (stage) => {
        return clients.filter(c => c.stage === stage);
    };

    const handleStageChange = async (clientId, newStage) => {
        await crmClients.update({ id: clientId, stage: newStage });
        fetchClients();
        if (selectedClient?.id === clientId) {
            setSelectedClient(prev => ({ ...prev, stage: newStage }));
        }
    };

    const handleCreateClient = async (e) => {
        e.preventDefault();
        setSaving(true);
        const res = await crmClients.create(newClient);
        if (res.success) {
            setShowNewModal(false);
            setNewClient({ full_name: '', phone: '', email: '', dni: '', source: 'manual' });
            fetchClients();
        }
        setSaving(false);
    };

    const openDrawer = async (client) => {
        setSelectedClient(client);
        const [notesRes, tasksRes] = await Promise.all([
            crmNotes.list(client.id),
            crmTasks.list(client.id)
        ]);
        setDrawerNotes(notesRes.data || []);
        setDrawerTasks(tasksRes.data || []);
    };

    const closeDrawer = () => {
        setSelectedClient(null);
        setDrawerNotes([]);
        setDrawerTasks([]);
        setNewNote('');
    };

    const handleAddNote = async () => {
        if (!newNote.trim()) return;
        setSaving(true);
        await crmNotes.create(selectedClient.id, newNote);
        setNewNote('');
        const res = await crmNotes.list(selectedClient.id);
        setDrawerNotes(res.data || []);
        fetchClients();
        setSaving(false);
    };

    const handleAddTask = async () => {
        if (!newTask.description.trim()) return;
        setSaving(true);
        await crmTasks.create(selectedClient.id, newTask.description, newTask.due_date || null);
        setNewTask({ description: '', due_date: '' });
        const res = await crmTasks.list(selectedClient.id);
        setDrawerTasks(res.data || []);
        setSaving(false);
    };

    const handleCompleteTask = async (taskId) => {
        await crmTasks.complete(taskId);
        const res = await crmTasks.list(selectedClient.id);
        setDrawerTasks(res.data || []);
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const d = new Date(dateStr);
        return d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="crm-gestion">
            {/* Header */}
            <div className="crm-page-header">
                <div>
                    <h1>Gestión de Clientes</h1>
                    <p>{clients.length} clientes en pipeline</p>
                </div>
                <div className="crm-header-actions">
                    <div className="crm-search">
                        <Search size={16} color="#8a96a8" />
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="crm-btn crm-btn-primary" onClick={() => setShowNewModal(true)}>
                        <Plus size={16} /> Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Pipeline */}
            {loading ? (
                <div className="crm-loading"><Loader2 size={20} className="crm-spinner" /> Cargando...</div>
            ) : (
                <div className="crm-pipeline">
                    {STAGES.map(stage => {
                        const stageClients = getClientsByStage(stage.key);
                        return (
                            <div key={stage.key} className="crm-pipeline-col">
                                <div className="crm-pipeline-col-header">
                                    <h3>{stage.emoji} {stage.label}</h3>
                                    <span className="crm-pipeline-count">{stageClients.length}</span>
                                </div>
                                {stageClients.map(client => (
                                    <div key={client.id} className="crm-client-card" onClick={() => openDrawer(client)}>
                                        <h4>{client.full_name}</h4>
                                        {client.phone && (
                                            <div className="client-phone">
                                                <Phone size={12} /> {client.phone}
                                            </div>
                                        )}
                                        {client.car_name && (
                                            <div className="client-car">🚗 {client.car_name}</div>
                                        )}
                                        {client.last_note && (
                                            <div className="client-note-preview">"{client.last_note}"</div>
                                        )}
                                        <div className="client-meta">
                                            {client.notes_count > 0 && <span><FileText size={10} /> {client.notes_count}</span>}
                                            {client.pending_tasks > 0 && <span><Clock size={10} /> {client.pending_tasks}</span>}
                                        </div>
                                    </div>
                                ))}
                                {stageClients.length === 0 && (
                                    <div className="crm-empty" style={{ padding: '20px' }}>
                                        <Users size={24} />
                                        <p style={{ fontSize: '0.78rem' }}>Sin clientes</p>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Client Detail Drawer */}
            {selectedClient && (
                <>
                    <div className="crm-drawer-overlay" onClick={closeDrawer} />
                    <div className="crm-drawer">
                        <div className="crm-drawer-header">
                            <h2>{selectedClient.full_name}</h2>
                            <button className="crm-drawer-close" onClick={closeDrawer}><X size={16} /></button>
                        </div>
                        <div className="crm-drawer-body">
                            {/* Contact actions */}
                            <div className="crm-contact-actions">
                                {selectedClient.phone && (
                                    <a href={`https://wa.me/${selectedClient.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="crm-contact-btn whatsapp">
                                        <MessageCircle size={14} /> WhatsApp
                                    </a>
                                )}
                                {selectedClient.phone && (
                                    <a href={`tel:${selectedClient.phone}`} className="crm-contact-btn phone">
                                        <Phone size={14} /> Llamar
                                    </a>
                                )}
                                {selectedClient.email && (
                                    <a href={`mailto:${selectedClient.email}`} className="crm-contact-btn email">
                                        <Mail size={14} /> Email
                                    </a>
                                )}
                            </div>

                            {/* Stage selector */}
                            <div className="crm-drawer-section">
                                <h3>Estado</h3>
                                <div className="crm-stage-selector">
                                    {STAGES.map(s => (
                                        <button
                                            key={s.key}
                                            className={`crm-stage-btn ${selectedClient.stage === s.key ? 'active' : ''} ${s.key === 'venta_realizada' ? 'venta' : ''}`}
                                            onClick={() => handleStageChange(selectedClient.id, s.key)}
                                        >
                                            {s.emoji} {s.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Car info */}
                            {selectedClient.car_name && (
                                <div className="crm-drawer-section">
                                    <h3>Vehículo de interés</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#2161f2', fontWeight: 600 }}>
                                        🚗 {selectedClient.car_name}
                                    </p>
                                </div>
                            )}

                            {/* Add note */}
                            <div className="crm-drawer-section">
                                <h3>Nueva Nota</h3>
                                <div className="crm-note-input">
                                    <textarea
                                        value={newNote}
                                        onChange={(e) => setNewNote(e.target.value)}
                                        placeholder="Escribir nota..."
                                    />
                                    <button className="crm-btn crm-btn-primary" onClick={handleAddNote} disabled={saving} style={{ alignSelf: 'flex-end' }}>
                                        {saving ? <Loader2 size={14} className="crm-spinner" /> : 'Guardar'}
                                    </button>
                                </div>
                            </div>

                            {/* Add task */}
                            <div className="crm-drawer-section">
                                <h3>Programar Tarea</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                    <input
                                        type="text"
                                        placeholder="Descripción de la tarea..."
                                        value={newTask.description}
                                        onChange={(e) => setNewTask(p => ({ ...p, description: e.target.value }))}
                                        style={{ border: '1px solid #e5e8ed', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', fontFamily: 'inherit', outline: 'none' }}
                                    />
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        <input
                                            type="datetime-local"
                                            value={newTask.due_date}
                                            onChange={(e) => setNewTask(p => ({ ...p, due_date: e.target.value }))}
                                            style={{ border: '1px solid #e5e8ed', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', fontFamily: 'inherit', flex: 1, outline: 'none' }}
                                        />
                                        <button className="crm-btn crm-btn-primary" onClick={handleAddTask} disabled={saving}>
                                            {saving ? <Loader2 size={14} className="crm-spinner" /> : 'Crear'}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tasks */}
                            {drawerTasks.length > 0 && (
                                <div className="crm-drawer-section">
                                    <h3>Tareas</h3>
                                    <div className="crm-timeline">
                                        {drawerTasks.map(task => (
                                            <div key={task.id} className={`crm-timeline-item task ${task.completed ? 'completed' : ''}`}>
                                                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                                    <div>
                                                        <p style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                                                            {task.description}
                                                        </p>
                                                        <span className="timeline-meta">
                                                            {task.due_date ? `📅 ${formatDate(task.due_date)}` : 'Sin fecha'} • {task.admin_name || 'Admin'}
                                                        </span>
                                                    </div>
                                                    {!task.completed && (
                                                        <button onClick={() => handleCompleteTask(task.id)} style={{ color: '#10b981', background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                                                            <CheckCircle size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Notes history */}
                            {drawerNotes.length > 0 && (
                                <div className="crm-drawer-section">
                                    <h3>Historial de Notas</h3>
                                    <div className="crm-timeline">
                                        {drawerNotes.map(note => (
                                            <div key={note.id} className="crm-timeline-item">
                                                <p>{note.content}</p>
                                                <span className="timeline-meta">
                                                    {formatDate(note.created_at)} • {note.admin_name || 'Admin'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Delete client */}
                            <div className="crm-drawer-section" style={{ marginTop: 32, paddingTop: 16, borderTop: '1px solid #e5e8ed' }}>
                                <button
                                    className="crm-btn crm-btn-danger"
                                    onClick={async () => {
                                        if (window.confirm('¿Dar de baja a este cliente?')) {
                                            await crmClients.remove(selectedClient.id);
                                            closeDrawer();
                                            fetchClients();
                                        }
                                    }}
                                >
                                    Dar de baja
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* New Client Modal */}
            {showNewModal && (
                <div className="crm-modal-overlay" onClick={() => setShowNewModal(false)}>
                    <div className="crm-modal" onClick={(e) => e.stopPropagation()}>
                        <h2>Nuevo Cliente</h2>
                        <form onSubmit={handleCreateClient}>
                            <div className="crm-form-group">
                                <label>Nombre completo *</label>
                                <input type="text" value={newClient.full_name} onChange={(e) => setNewClient(p => ({ ...p, full_name: e.target.value }))} required autoFocus />
                            </div>
                            <div className="crm-form-group">
                                <label>Teléfono</label>
                                <input type="tel" value={newClient.phone} onChange={(e) => setNewClient(p => ({ ...p, phone: e.target.value }))} placeholder="+54 9 351..." />
                            </div>
                            <div className="crm-form-group">
                                <label>Email</label>
                                <input type="email" value={newClient.email} onChange={(e) => setNewClient(p => ({ ...p, email: e.target.value }))} />
                            </div>
                            <div className="crm-form-group">
                                <label>DNI</label>
                                <input type="text" value={newClient.dni} onChange={(e) => setNewClient(p => ({ ...p, dni: e.target.value }))} />
                            </div>
                            <div className="crm-form-group">
                                <label>Origen</label>
                                <select value={newClient.source} onChange={(e) => setNewClient(p => ({ ...p, source: e.target.value }))}>
                                    <option value="manual">Manual</option>
                                    <option value="web">Sitio Web</option>
                                    <option value="whatsapp">WhatsApp</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="referido">Referido</option>
                                </select>
                            </div>
                            <div className="crm-form-actions">
                                <button type="button" className="crm-btn crm-btn-secondary" onClick={() => setShowNewModal(false)}>Cancelar</button>
                                <button type="submit" className="crm-btn crm-btn-primary" disabled={saving}>
                                    {saving ? <Loader2 size={14} className="crm-spinner" /> : 'Crear Cliente'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CRMGestion;
