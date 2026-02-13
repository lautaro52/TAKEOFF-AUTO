import React, { useState, useEffect } from 'react';
import { leadService } from '../../services/leadService';
import './SellerDashboard.css';

const SellerDashboard = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadLeads();
    }, []);

    const loadLeads = async () => {
        try {
            const res = await leadService.getAll();
            if (res.success && res.data && res.data.length > 0) {
                setLeads(res.data);
            } else {
                // Fallback de demo
                setLeads([
                    { id: 101, client_name: 'Lucia Fernandez', client_whatsapp: '1166554433', brand: 'Ford', model: 'Ranger', year: 2022, partner_name: 'Juan Datero', status: 'recibido' },
                    { id: 102, client_name: 'Marcos Lopez', client_whatsapp: '1155443322', brand: 'Toyota', model: 'Corolla', year: 2021, partner_name: 'Juan Datero', status: 'en_gestion' },
                    { id: 103, client_name: 'Sofia Rodriguez', client_whatsapp: '1144332211', brand: 'VW', model: 'Amarok', year: 2023, partner_name: 'Juan Datero', status: 'aprobacion_crediticia' },
                    { id: 104, client_name: 'Daniela Paz', client_whatsapp: '1133221100', brand: 'Chevrolet', model: 'Cruze', year: 2022, partner_name: 'Juan Datero', status: 'en_gestion' },
                    { id: 105, client_name: 'Ignacio Ruiz', client_whatsapp: '1122110099', brand: 'Honda', model: 'HR-V', year: 2020, partner_name: 'Juan Datero', status: 'recibido' }
                ]);
            }
        } catch (error) {
            console.error('Error loading leads', error);
            // Si hay error de red, forzamos los datos de datero para la demo
            setLeads([
                { id: 101, client_name: 'Lucia Fernandez', client_whatsapp: '1166554433', brand: 'Ford', model: 'Ranger', year: 2022, partner_name: 'Juan Datero', status: 'recibido' },
                { id: 102, client_name: 'Marcos Lopez', client_whatsapp: '1155443322', brand: 'Toyota', model: 'Corolla', year: 2021, partner_name: 'Juan Datero', status: 'en_gestion' },
                { id: 103, client_name: 'Sofia Rodriguez', client_whatsapp: '1144332211', brand: 'VW', model: 'Amarok', year: 2023, partner_name: 'Juan Datero', status: 'aprobacion_crediticia' },
                { id: 104, client_name: 'Daniela Paz', client_whatsapp: '1133221100', brand: 'Chevrolet', model: 'Cruze', year: 2022, partner_name: 'Juan Datero', status: 'en_gestion' },
                { id: 105, client_name: 'Ignacio Ruiz', client_whatsapp: '1122110099', brand: 'Honda', model: 'HR-V', year: 2020, partner_name: 'Juan Datero', status: 'recibido' }
            ]);
        }
        setLoading(false);
    };

    const handleStatusUpdate = async (leadId, newStatus) => {
        try {
            const res = await leadService.updateStatus(leadId, newStatus);
            if (res.success) {
                // Actualizar localmente para feedback instantáneo
                setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
            }
        } catch (error) {
            console.error('Error updating status', error);
        }
    };

    const handleCommentUpdate = (leadId, comment) => {
        setLeads(leads.map(l => l.id === leadId ? { ...l, note: comment } : l));
    };

    if (loading) return <div>Cargando gestión de ventas...</div>;

    const statuses = [
        { label: 'Recibido', value: 'recibido' },
        { label: 'En Gestión', value: 'en_gestion' },
        { label: 'Crédito', value: 'aprobacion_crediticia' },
        { label: 'Vendido', value: 'venta_cerrada' },
        { label: 'Caída', value: 'caida' }
    ];

    return (
        <div className="seller-dashboard">
            <header className="seller-header">
                <h1>Bandeja de Leads de Partners</h1>
                <p>Gestioná a los clientes enviados por tus dateros.</p>
            </header>

            <div className="lead-inbox">
                <table className="lead-table">
                    <thead>
                        <tr>
                            <th>Cliente</th>
                            <th>Auto Interés</th>
                            <th>Partner</th>
                            <th>Estado Actual</th>
                            <th>Acciones de Cambio de Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map(lead => (
                            <tr key={lead.id}>
                                <td>
                                    <div className="client-data">
                                        <strong>{lead.client_name}</strong>
                                        <div>{lead.client_whatsapp}</div>
                                    </div>
                                </td>
                                <td>{lead.brand} {lead.model} ({lead.year})</td>
                                <td>
                                    <span className="partner-tag">{lead.partner_name || 'Partner Ext'}</span>
                                </td>
                                <td>
                                    <span className={`status-badge status-${lead.status}`}>
                                        {lead.status.replace(/_/g, ' ')}
                                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        {statuses.map(s => (
                                            <button
                                                key={s.value}
                                                className={`status-btn ${lead.status === s.value ? 'active' : ''}`}
                                                onClick={() => handleStatusUpdate(lead.id, s.value)}
                                            >
                                                {s.label}
                                            </button>
                                        ))}
                                        <div className="mini-note-container">
                                            <input
                                                type="text"
                                                className="mini-note-input"
                                                placeholder="Nota rápida..."
                                                value={lead.note || ''}
                                                onChange={(e) => handleCommentUpdate(lead.id, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SellerDashboard;
