import React, { useState, useEffect, useCallback } from 'react';
import { crmClients, crmNotes, crmTasks } from '../../services/crmService';
import { Plus, Search, Mail, Phone, MessageSquare, Clock, CheckCircle2, X, Loader2, UserPlus, Calendar, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import './CRM.css';

const stages = [
    { id: 'sin_gestionar', label: 'Sin Gestionar', color: '#64748b' },
    { id: 'primer_contacto', label: 'Primer Contacto', color: '#3b82f6' },
    { id: 'negociacion', label: 'Negociación', color: '#f59e0b' },
    { id: 'venta_realizada', label: 'Venta Realizada', color: '#10b981' }
];

const CRMGestion = () => {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedClient, setSelectedClient] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Detail view state
    const [notes, setNotes] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [saving, setSaving] = useState(false);

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

    const handleAddNote = async (e) => {
        e.preventDefault();
        if (!newNote.trim()) return;
        setSaving(true);
        try {
            const res = await crmNotes.create({ client_id: selectedClient.id, content: newNote });
            if (res.success) {
                setNotes(prev => [res.data, ...prev]);
                setNewNote('');
            }
        } catch (e) {
            console.error('Add note error:', e);
        }
        setSaving(false);
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
        `${c.full_name} ${c.whatsapp} ${c.car_model || ''}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                                    <MessageSquare size={14} /> {client.whatsapp}
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
                            <div className="crm-drawer-header">
                                <div>
                                    <h2>{selectedClient.full_name}</h2>
                                    <p style={{ color: '#64748b' }}>{selectedClient.email || 'Sin correo electrónico'}</p>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button className="crm-btn crm-btn-secondary" onClick={handleDeleteClient} style={{ padding: 10, borderRadius: 12 }}>
                                        <Trash2 size={20} color="#ef4444" />
                                    </button>
                                    <button className="crm-drawer-close" onClick={() => setSelectedClient(null)}>
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            <div className="crm-drawer-body">
                                <div className="crm-contact-actions">
                                    <a href={`https://wa.me/${selectedClient.whatsapp?.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="crm-contact-btn whatsapp">
                                        <MessageSquare size={16} /> WhatsApp
                                    </a>
                                    <a href={`tel:${selectedClient.whatsapp}`} className="crm-contact-btn phone">
                                        <Phone size={16} /> Llamar
                                    </a>
                                    {selectedClient.email && (
                                        <a href={`mailto:${selectedClient.email}`} className="crm-contact-btn email">
                                            <Mail size={16} /> Email
                                        </a>
                                    )}
                                </div>

                                <div className="crm-drawer-section">
                                    <h3>Estado del Prospecto</h3>
                                    <div className="crm-stage-selector">
                                        {stages.map(s => (
                                            <button
                                                key={s.id}
                                                className={`crm-stage-btn ${selectedClient.stage === s.id ? 'active' : ''} ${s.id === 'venta_realizada' ? 'venta' : ''}`}
                                                onClick={() => handleUpdateStage(selectedClient.id, s.id)}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                        <button
                                            className={`crm-stage-btn ${selectedClient.stage === 'dado_de_baja' ? 'active' : ''}`}
                                            onClick={() => handleUpdateStage(selectedClient.id, 'dado_de_baja')}
                                            style={{ color: '#ef4444', borderColor: '#ef4444' }}
                                        >
                                            Baja
                                        </button>
                                    </div>
                                </div>

                                <div className="crm-drawer-section">
                                    <h3>Seguimiento y Notas</h3>
                                    <form onSubmit={handleAddNote} className="crm-note-input" style={{ marginBottom: 24 }}>
                                        <textarea
                                            placeholder="Escribe una actualización..."
                                            value={newNote}
                                            onChange={(e) => setNewNote(e.target.value)}
                                            required
                                        />
                                        <button type="submit" disabled={saving} className="crm-btn crm-btn-primary">
                                            {saving ? <Loader2 size={20} className="crm-spinner" /> : <Plus size={20} />}
                                        </button>
                                    </form>

                                    <div className="crm-timeline">
                                        {notes.map(note => (
                                            <div key={note.id} className="crm-timeline-item">
                                                <p>{note.content}</p>
                                                <span className="timeline-meta">{formatDate(note.created_at)} • {note.admin_name || 'Admin'}</span>
                                            </div>
                                        ))}
                                        {notes.length === 0 && <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>No hay notas aún.</p>}
                                    </div>
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
                                    <input name="whatsapp" required placeholder="Ej: 3512345678" />
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
