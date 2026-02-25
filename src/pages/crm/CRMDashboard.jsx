import React, { useState, useEffect } from 'react';
import { crmDashboard } from '../../services/crmService';
import { TrendingUp, Users, DollarSign, UserX, ClipboardList, Package, Loader2, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
        return (
            <div className="crm-loading">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <Loader2 size={32} />
                </motion.div>
                Cargando dashboard premium...
            </div>
        );
    }

    const totalPipeline = data?.stages
        ? Object.entries(data.stages).filter(([k]) => k !== 'dado_de_baja').reduce((a, [, v]) => a + v, 0)
        : 0;

    const maxSale = data?.daily_sales ? Math.max(...data.daily_sales.map(d => Number(d.revenue) || 1), 1) : 1;
    const maxFunnel = data?.stages ? Math.max(...Object.values(data.stages), 1) : 1;

    const kpis = [
        { label: 'Ventas', value: data?.total_sales || 0, change: fmtMoney(data?.total_revenue), type: 'positive', icon: DollarSign },
        { label: 'Clientes Activos', value: totalPipeline, change: `+${data?.new_clients || 0} nuevos`, type: 'positive', icon: Users },
        { label: 'Dados de Baja', value: data?.lost_clients || 0, change: `${data?.stages?.dado_de_baja || 0} totales`, type: 'negative', icon: UserX },
        { label: 'Stock Total', value: data?.stock?.total || 0, change: `${data?.stock?.with_photos || 0} con fotos`, type: 'default', icon: Package }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="crm-dashboard-page"
        >
            <div className="crm-page-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Métricas clave y rendimiento de ventas</p>
                </div>
                <div className="crm-date-range">
                    <Calendar size={18} color="#64748b" />
                    <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    <span style={{ color: '#8a96a8' }}>→</span>
                    <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    <button className="crm-btn crm-btn-secondary" onClick={fetchData}>
                        Actualizar
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="crm-kpi-grid">
                {kpis.map((kpi, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="crm-kpi-card"
                    >
                        <span className="kpi-label">
                            <kpi.icon size={16} /> {kpi.label}
                        </span>
                        <span className="kpi-value">{kpi.value}</span>
                        <span className={`kpi-change ${kpi.type}`}>{kpi.change}</span>
                    </motion.div>
                ))}
            </div>

            {/* Charts Area */}
            <div className="crm-chart-grid">
                {/* Bar chart — daily sales */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="crm-chart-card"
                >
                    <h3>📈 Rendimiento Diario</h3>
                    {data?.daily_sales?.length > 0 ? (
                        <div className="crm-bar-chart">
                            {data.daily_sales.map((day, i) => (
                                <motion.div
                                    key={i}
                                    className="crm-bar"
                                    initial={{ height: 0 }}
                                    animate={{ height: `${(Number(day.revenue) / maxSale) * 100}%` }}
                                    transition={{ duration: 0.8, delay: 0.5 + (i * 0.05), ease: "easeOut" }}
                                >
                                    <span className="bar-value">{day.count}</span>
                                    <span className="bar-label">{new Date(day.sale_date).toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })}</span>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="crm-empty">
                            <ClipboardList size={48} color="#e2e8f0" />
                            <p>Sin datos en este período</p>
                        </div>
                    )}
                </motion.div>

                {/* Funnel */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="crm-chart-card"
                >
                    <h3>🔽 Embudo de Clientes</h3>
                    <div className="crm-funnel">
                        {Object.entries(stageLabels).filter(([k]) => k !== 'dado_de_baja').map(([key, label], idx) => {
                            const count = data?.stages?.[key] || 0;
                            return (
                                <div key={key} className="crm-funnel-step">
                                    <span className="funnel-label">{label}</span>
                                    <div style={{ flex: 1, background: '#f1f5f9', borderRadius: 10, overflow: 'hidden' }}>
                                        <motion.div
                                            className="funnel-bar"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(count / maxFunnel) * 100}%` }}
                                            transition={{ duration: 1, delay: 0.8 + (idx * 0.1) }}
                                        />
                                    </div>
                                    <span className="funnel-count">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>

            {/* Pending tasks summary feature */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="crm-card"
                style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: 'none', color: '#fff' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#f59e0b', padding: 8, borderRadius: 10 }}>
                        <ClipboardList size={20} color="#fff" />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#fff' }}>Tareas Pendientes</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16 }}>
                    <span style={{ fontSize: '3rem', fontWeight: 900, lineHeight: 1 }}>{data?.pending_tasks || 0}</span>
                    <p style={{ fontSize: '0.95rem', color: '#94a3b8', margin: 0, marginBottom: 8 }}>Acciones inmediatas requeridas</p>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default CRMDashboard;
