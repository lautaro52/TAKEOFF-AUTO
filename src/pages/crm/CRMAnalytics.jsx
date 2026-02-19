import React, { useState, useEffect } from 'react';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    Target,
    Clock,
    Download
} from 'lucide-react';
import {
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import DateRangeFilter from '../../components/crm/DateRangeFilter';
import { getCustomerStats, getOpportunities, getPipelineData, getConversionMetrics } from '../../services/crmService';
import './CRMAnalytics.css';

const CRMAnalytics = () => {
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState({
        from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        to: new Date().toISOString().split('T')[0]
    });

    const [analytics, setAnalytics] = useState({
        totalRevenue: 0,
        conversionRate: 0,
        avgClosingTime: 0,
        avgDealValue: 0,
        leadsBySource: [],
        funnelData: [],
        salesPerformance: [],
        temporalData: []
    });

    const [adSpend, setAdSpend] = useState({
        google_ads: 0,
        facebook_ads: 0,
        instagram_ads: 0,
        other: 0
    });

    const [roiData, setRoiData] = useState([]);

    useEffect(() => {
        loadAnalytics();
    }, [dateRange]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);

            // Load customer stats
            const customerStatsRes = await getCustomerStats();
            const customerStats = customerStatsRes.data;

            // Load opportunities
            const opportunitiesRes = await getOpportunities();
            const opportunities = opportunitiesRes.data || [];

            // Load pipeline data
            const pipelineRes = await getPipelineData();
            const pipeline = pipelineRes.data;

            // Load conversion metrics
            const metricsRes = await getConversionMetrics(dateRange.from, dateRange.to);
            const metrics = metricsRes.data;

            // Process leads by source
            const sourceData = [
                { name: 'Website', value: customerStats.by_source?.website || 0, color: '#4285F4' },
                { name: 'Partner', value: customerStats.by_source?.partner || 0, color: '#EA4335' },
                { name: 'Direct', value: customerStats.by_source?.direct || 0, color: '#9AA0A6' },
                { name: 'Referral', value: customerStats.by_source?.referral || 0, color: '#FBBC04' },
                { name: 'Marketing', value: customerStats.by_source?.marketing || 0, color: '#34A853' }
            ].filter(item => item.value > 0);

            // Process funnel data
            const stages = pipeline.stages || {};
            const funnelData = [
                { name: 'Nuevo', value: stages.new?.length || 0, percentage: 100 },
                { name: 'Contactado', value: stages.contacted?.length || 0, percentage: 0 },
                { name: 'Calificado', value: stages.qualified?.length || 0, percentage: 0 },
                { name: 'Propuesta', value: stages.proposal?.length || 0, percentage: 0 },
                { name: 'Negociación', value: stages.negotiation?.length || 0, percentage: 0 },
                { name: 'Ganado', value: stages.closed_won?.length || 0, percentage: 0 }
            ];

            // Calculate conversion percentages
            const totalLeads = funnelData[0].value;
            funnelData.forEach((stage, index) => {
                if (index > 0 && totalLeads > 0) {
                    stage.percentage = ((stage.value / totalLeads) * 100).toFixed(1);
                }
            });

            // Mock temporal data (replace with real API)
            const temporalData = generateTemporalData(dateRange.from, dateRange.to);

            setAnalytics({
                totalRevenue: metrics.total_won_value || 0,
                conversionRate: metrics.conversion_rate || 0,
                avgClosingTime: metrics.avg_closing_time || 0,
                avgDealValue: metrics.avg_deal_value || 0,
                leadsBySource: sourceData,
                funnelData,
                salesPerformance: [], // Would come from API
                temporalData
            });

        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateTemporalData = (from, to) => {
        // Mock data - replace with real API
        const data = [];
        const start = new Date(from);
        const end = new Date(to);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= Math.min(days, 30); i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            data.push({
                date: date.toLocaleDateString('es-AR', { month: 'short', day: 'numeric' }),
                leads: Math.floor(Math.random() * 20) + 5,
                opportunities: Math.floor(Math.random() * 15) + 3,
                sales: Math.floor(Math.random() * 5) + 1,
                revenue: Math.floor(Math.random() * 500000) + 100000
            });
        }
        return data;
    };

    const calculateROI = () => {
        const roiResults = Object.entries(adSpend).map(([channel, spend]) => {
            const channelLeads = analytics.leadsBySource.find(s =>
                s.name.toLowerCase() === channel.replace('_', ' ')
            );
            const leads = channelLeads?.value || 0;
            const revenue = leads * analytics.avgDealValue * (analytics.conversionRate / 100);
            const roi = spend > 0 ? (((revenue - spend) / spend) * 100) : 0;
            const roas = spend > 0 ? (revenue / spend) : 0;
            const cpl = leads > 0 ? (spend / leads) : 0;
            const sales = Math.floor(leads * (analytics.conversionRate / 100));
            const cpa = sales > 0 ? (spend / sales) : 0;

            return {
                channel: channel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
                spend,
                revenue,
                roi,
                roas,
                leads,
                cpl,
                sales,
                cpa
            };
        }).filter(item => item.spend > 0);

        setRoiData(roiResults);
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 0
        }).format(value || 0);
    };

    const formatPercentage = (value) => {
        return `${(value || 0).toFixed(2)}%`;
    };

    const getROIColor = (roi) => {
        if (roi > 100) return '#10b981';
        if (roi > 0) return '#f59e0b';
        return '#ef4444';
    };

    if (loading) {
        return (
            <div className="analytics-loading">
                <div className="spinner"></div>
                <p>Cargando analytics...</p>
            </div>
        );
    }

    return (
        <div className="crm-analytics">
            {/* Header */}
            <div className="analytics-header">
                <h1>Analytics y Reportes</h1>

                <div className="header-filters">
                    <DateRangeFilter
                        onChange={(range) => setDateRange(range)}
                        defaultRange={dateRange}
                    />
                    <button className="btn-export">
                        <Download size={18} />
                        Exportar Reporte
                    </button>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="kpi-cards">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
                        <DollarSign size={24} color="#10b981" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Total Revenue</p>
                        <h2 className="kpi-value">{formatCurrency(analytics.totalRevenue)}</h2>
                        <p className="kpi-trend positive">
                            <TrendingUp size={14} />
                            +15% vs período anterior
                        </p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#dbeafe' }}>
                        <Target size={24} color="#2563eb" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Tasa de Conversión</p>
                        <h2 className="kpi-value">{formatPercentage(analytics.conversionRate)}</h2>
                        <p className="kpi-trend negative">
                            <TrendingDown size={14} />
                            -2% vs período anterior
                        </p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#fef3c7' }}>
                        <Clock size={24} color="#f59e0b" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Tiempo Promedio de Cierre</p>
                        <h2 className="kpi-value">{analytics.avgClosingTime}d</h2>
                        <p className="kpi-trend positive">
                            <TrendingUp size={14} />
                            -5d vs período anterior
                        </p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#f3e8ff' }}>
                        <DollarSign size={24} color="#a855f7" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Valor Promedio de Deal</p>
                        <h2 className="kpi-value">{formatCurrency(analytics.avgDealValue)}</h2>
                        <p className="kpi-trend positive">
                            <TrendingUp size={14} />
                            +8% vs período anterior
                        </p>
                    </div>
                </div>
            </div>

            {/* Lead Sources Section */}
            <div className="analytics-section">
                <h2>Fuentes de Leads</h2>
                <div className="two-column-grid">
                    <div className="chart-card">
                        <h3>Distribución por Fuente</h3>
                        {analytics.leadsBySource.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={analytics.leadsBySource}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {analytics.leadsBySource.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="no-data">No hay datos disponibles</p>
                        )}
                    </div>

                    <div className="table-card">
                        <h3>Métricas por Fuente</h3>
                        <table className="analytics-table">
                            <thead>
                                <tr>
                                    <th>Fuente</th>
                                    <th># Leads</th>
                                    <th>Conversión</th>
                                </tr>
                            </thead>
                            <tbody>
                                {analytics.leadsBySource.map((source) => (
                                    <tr key={source.name}>
                                        <td>
                                            <span className="source-badge" style={{ backgroundColor: source.color }}>
                                                {source.name}
                                            </span>
                                        </td>
                                        <td>{source.value}</td>
                                        <td>{formatPercentage(analytics.conversionRate)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Conversion Funnel */}
            <div className="analytics-section">
                <h2>Embudo de Conversión</h2>
                <div className="chart-card">
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.funnelData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#2563eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ROI Calculator */}
            <div className="analytics-section">
                <h2>ROI por Canal de Marketing</h2>
                <div className="roi-calculator">
                    <div className="ad-spend-form">
                        <h3>Gastos de Publicidad</h3>
                        <div className="spend-inputs">
                            {Object.keys(adSpend).map((channel) => (
                                <div key={channel} className="spend-input">
                                    <label>{channel.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</label>
                                    <input
                                        type="number"
                                        value={adSpend[channel]}
                                        onChange={(e) => setAdSpend({ ...adSpend, [channel]: parseFloat(e.target.value) || 0 })}
                                        placeholder="$0"
                                    />
                                </div>
                            ))}
                        </div>
                        <button className="btn-primary" onClick={calculateROI}>
                            Calcular ROI
                        </button>
                    </div>

                    {roiData.length > 0 && (
                        <div className="roi-results">
                            <h3>Resultados de ROI</h3>
                            <table className="analytics-table">
                                <thead>
                                    <tr>
                                        <th>Canal</th>
                                        <th>Gasto</th>
                                        <th>Revenue</th>
                                        <th>ROI</th>
                                        <th>ROAS</th>
                                        <th>CPL</th>
                                        <th>CPA</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {roiData.map((row) => (
                                        <tr key={row.channel}>
                                            <td>{row.channel}</td>
                                            <td>{formatCurrency(row.spend)}</td>
                                            <td>{formatCurrency(row.revenue)}</td>
                                            <td style={{ color: getROIColor(row.roi), fontWeight: 'bold' }}>
                                                {formatPercentage(row.roi)}
                                            </td>
                                            <td>{row.roas.toFixed(2)}x</td>
                                            <td>{formatCurrency(row.cpl)}</td>
                                            <td>{formatCurrency(row.cpa)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Temporal Metrics */}
            <div className="analytics-section">
                <h2>Métricas Temporales</h2>
                <div className="chart-card">
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={analytics.temporalData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis yAxisId="left" />
                            <YAxis yAxisId="right" orientation="right" />
                            <Tooltip />
                            <Legend />
                            <Line yAxisId="left" type="monotone" dataKey="leads" stroke="#3b82f6" name="Leads" />
                            <Line yAxisId="left" type="monotone" dataKey="opportunities" stroke="#f59e0b" name="Oportunidades" />
                            <Line yAxisId="left" type="monotone" dataKey="sales" stroke="#10b981" name="Ventas" />
                            <Line yAxisId="right" type="monotone" dataKey="revenue" stroke="#a855f7" name="Revenue" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default CRMAnalytics;
