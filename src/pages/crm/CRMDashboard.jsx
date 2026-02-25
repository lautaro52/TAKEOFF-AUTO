import React, { useState, useEffect } from 'react';
import { crmDashboard } from '../../services/crmService';
import { TrendingUp, Users, DollarSign, UserX, ClipboardList, Package, Loader2 } from 'lucide-react';
import './CRM.css';

const CRMDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [from, setFrom] = useState(() => {
        const d = new Date();
        d.setDate(1);
        return d.toISOString().split('T')[0];
    });
    const [to, setTo] = useState(() => new Date().toISOString().split('T')[0]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await crmDashboard.getStats(from, to);
            if (res.success) setData(res.data);
        } catch (e) { console.error(e); }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, [from, to]);

    const fmtMoney = (n) => {
        n = Number(n) || 0;
        return '$' + n.toLocaleString('es-AR', { maximumFractionDigits: 0 });
    };

    const stageLabels = {
        sin_gestionar: 'Sin Gestionar',
        primer_contacto: 'Primer Contacto',
        negociacion: 'Negociación',
        venta_realizada: 'Venta Realizada',
        dado_de_baja: 'Dado de Baja'
    };

    if (loading && !data) {
        return <div className="crm-loading"><Loader2 size={20} className="crm-spinner" /> Cargando dashboard...</div>;
    }

    const totalPipeline = data?.stages
        ? Object.entries(data.stages).filter(([k]) => k !== 'dado_de_baja').reduce((a, [, v]) => a + v, 0)
        : 0;

    const maxSale = data?.daily_sales ? Math.max(...data.daily_sales.map(d => Number(d.revenue) || 1), 1) : 1;
    const maxFunnel = data?.stages ? Math.max(...Object.values(data.stages), 1) : 1;

    return (
        <div className="crm-dashboard-page">
            <div className="crm-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Resumen del período seleccionado</p>
                </div>
                <div className="crm-date-range">
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    <span style={{ color: '#8a96a8' }}>hasta</span>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    <button className="crm-btn crm-btn-secondary" onClick={fetchData}>
                        Actualizar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="crm-kpi-grid">
                <div className="crm-kpi-card">
                    <span className="kpi-label"><DollarSign size={14} style={{ verticalAlign: 'middle' }} /> Ventas</span>
                    <span className="kpi-value">{data?.total_sales || 0}</span>
                    <span className="kpi-change positive">{fmtMoney(data?.total_revenue)} facturado</span>
                </div>
                <div className="crm-kpi-card">
                    <span className="kpi-label"><Users size={14} style={{ verticalAlign: 'middle' }} /> Clientes Activos</span>
                    <span className="kpi-value">{totalPipeline}</span>
                    <span className="kpi-change positive">+{data?.new_clients || 0} nuevos</span>
                </div>
                <div className="crm-kpi-card">
                    <span className="kpi-label"><UserX size={14} style={{ verticalAlign: 'middle' }} /> Dados de Baja</span>
                    <span className="kpi-value">{data?.lost_clients || 0}</span>
                    <span className="kpi-change negative">{data?.stages?.dado_de_baja || 0} totales</span>
                </div>
                <div className="crm-kpi-card">
                    <span className="kpi-label"><Package size={14} style={{ verticalAlign: 'middle' }} /> Stock</span>
                    <span className="kpi-value">{data?.stock?.total || 0}</span>
                    <span className="kpi-change">{data?.stock?.with_photos || 0} con fotos / {data?.stock?.without_photos || 0} sin</span>
                </div>
            </div>

            {/* Charts */}
            <div className="crm-chart-grid">
                {/* Bar chart — daily sales */}
                <div className="crm-chart-card">
                    <h3>📊 Ventas por Día</h3>
                    {data?.daily_sales?.length > 0 ? (
                        <div className="crm-bar-chart">
                            {data.daily_sales.map((day, i) => (
                                <div key={i} className="crm-bar" style={{ height: `${(Number(day.revenue) / maxSale) * 100}%` }}>
                                    <span className="bar-value">{day.count}</span>
                                    <span className="bar-label">{new Date(day.sale_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="crm-empty"><ClipboardList size={32} /><p>Sin ventas en el período</p></div>
                    )}
                </div>

                {/* Funnel */}
                <div className="crm-chart-card">
                    <h3>🔽 Pipeline</h3>
                    <div className="crm-funnel">
                        {Object.entries(stageLabels).filter(([k]) => k !== 'dado_de_baja').map(([key, label]) => {
                            const count = data?.stages?.[key] || 0;
                            return (
                                <div key={key} className="crm-funnel-step">
                                    <span className="funnel-label">{label}</span>
                                    <div style={{ flex: 1 }}>
                                        <div className="funnel-bar" style={{ width: `${(count / maxFunnel) * 100}%` }} />
                                    </div>
                                    <span className="funnel-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Pending tasks */}
            <div className="crm-card" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <ClipboardList size={18} color="#f59e0b" />
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Tareas Pendientes</h3>
                </div>
                <p style={{ fontSize: '1.4rem', fontWeight: 800, color: '#050b18' }}>{data?.pending_tasks || 0}</p>
                <p style={{ fontSize: '0.8rem', color: '#8a96a8' }}>tareas por completar</p>
            </div>
        </div>
    );
};

export default CRMDashboard;
