import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    TrendingUp,
    Target,
    DollarSign,
    Clock,
    CheckCircle2,
    Phone,
    Mail,
    MessageSquare,
    Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import {
    getCustomerStats,
    getOpportunities,
    getPipelineData,
    getConversionMetrics,
    getTasks,
    getRecentActivities
} from '../../services/crmService';
import { getStoredUser } from '../../services/authService';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    const user = getStoredUser();

    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalCustomers: 0,
        openOpportunities: 0,
        conversionRate: 0,
        monthlyRevenue: 0
    });
    const [leadsBySource, setLeadsBySource] = useState([]);
    const [funnelData, setFunnelData] = useState([]);
    const [recentOpportunities, setRecentOpportunities] = useState([]);
    const [todayTasks, setTodayTasks] = useState([]);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);

            // Load customer stats
            const customerStatsRes = await getCustomerStats();
            const customerStats = customerStatsRes.data;

            // Load opportunities
            const opportunitiesRes = await getOpportunities({ stage: 'new,contacted,proposal,negotiation,financing_approval' });
            const opportunities = opportunitiesRes.data;

            // Load pipeline data
            const pipelineRes = await getPipelineData();
            const pipeline = pipelineRes.data;

            // Load conversion metrics for current month
            const today = new Date();
            const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
            const dateFrom = firstDay.toISOString().split('T')[0];
            const dateTo = today.toISOString().split('T')[0];

            const metricsRes = await getConversionMetrics(dateFrom, dateTo);
            const metrics = metricsRes.data;

            // Load today's tasks
            const tasksRes = await getTasks({
                assigned_to: user.id,
                status: 'pending'
            });
            const allTasks = tasksRes.data;
            const today_str = today.toISOString().split('T')[0];
            const todayTasksFiltered = allTasks.filter(task =>
                task.due_date && task.due_date.startsWith(today_str)
            );

            // Load recent activities
            const activitiesRes = await getRecentActivities(user.id, 10);
            const activities = activitiesRes.data;

            // Process stats
            setStats({
                totalCustomers: customerStats.total_customers || 0,
                openOpportunities: opportunities.length,
                conversionRate: metrics.conversion_rate || 0,
                monthlyRevenue: metrics.total_won_value || 0
            });

            // Process leads by source
            const sourceData = [
                { name: 'Website', value: customerStats.by_source?.website || 0, color: '#4285F4' },
                { name: 'Partner', value: customerStats.by_source?.partner || 0, color: '#EA4335' },
                { name: 'Direct', value: customerStats.by_source?.direct || 0, color: '#9AA0A6' },
                { name: 'Referral', value: customerStats.by_source?.referral || 0, color: '#FBBC04' },
                { name: 'Marketing', value: customerStats.by_source?.marketing || 0, color: '#34A853' }
            ].filter(item => item.value > 0);
            setLeadsBySource(sourceData);

            // Process funnel data
            const stages = pipeline.stages || {};
            const funnelStages = [
                { name: 'Nuevo', value: stages.new?.length || 0 },
                { name: 'Contactado', value: stages.contacted?.length || 0 },
                { name: 'Propuesta', value: stages.proposal?.length || 0 },
                { name: 'Negociación', value: stages.negotiation?.length || 0 },
                { name: 'Financiamiento', value: stages.financing_approval?.length || 0 },
                { name: 'Ganado', value: stages.closed_won?.length || 0 }
            ];
            setFunnelData(funnelStages);

            // Set recent opportunities (limit 10)
            setRecentOpportunities(opportunities.slice(0, 10));

            // Set today's tasks
            setTodayTasks(todayTasksFiltered);

            // Set recent activities
            setRecentActivities(activities);

        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteTask = async (taskId) => {
        try {
            // Import completeTask from crmService
            const { completeTask } = await import('../../services/crmService');
            await completeTask(taskId);
            // Reload tasks
            loadDashboardData();
        } catch (error) {
            console.error('Error completing task:', error);
        }
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'call': return <Phone size={16} />;
            case 'email': return <Mail size={16} />;
            case 'meeting': return <Calendar size={16} />;
            case 'whatsapp': return <MessageSquare size={16} />;
            default: return <MessageSquare size={16} />;
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

    const getPriorityBadge = (priority) => {
        const colors = {
            high: '#ef4444',
            medium: '#f59e0b',
            low: '#10b981'
        };
        return (
            <span
                className="priority-badge"
                style={{ backgroundColor: colors[priority] || colors.medium }}
            >
                {priority === 'high' ? 'Alta' : priority === 'medium' ? 'Media' : 'Baja'}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="spinner"></div>
                <p>Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <div className="crm-dashboard">
            <h1>Dashboard CRM</h1>

            {/* KPI Cards */}
            <div className="kpi-grid">
                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#eff6ff' }}>
                        <Users size={24} color="#2563eb" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Total Clientes</p>
                        <h2 className="kpi-value">{stats.totalCustomers}</h2>
                        <p className="kpi-change positive">+12% vs mes pasado</p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#fef3c7' }}>
                        <TrendingUp size={24} color="#f59e0b" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Oportunidades Abiertas</p>
                        <h2 className="kpi-value">{stats.openOpportunities}</h2>
                        <p className="kpi-change positive">+8% vs mes pasado</p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#dcfce7' }}>
                        <Target size={24} color="#10b981" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Tasa de Conversión</p>
                        <h2 className="kpi-value">{stats.conversionRate.toFixed(1)}%</h2>
                        <p className="kpi-change negative">-2% vs mes pasado</p>
                    </div>
                </div>

                <div className="kpi-card">
                    <div className="kpi-icon" style={{ backgroundColor: '#fce7f3' }}>
                        <DollarSign size={24} color="#ec4899" />
                    </div>
                    <div className="kpi-content">
                        <p className="kpi-label">Revenue del Mes</p>
                        <h2 className="kpi-value">${(stats.monthlyRevenue / 1000).toFixed(0)}K</h2>
                        <p className="kpi-change positive">+15% vs mes pasado</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="charts-grid">
                <div className="chart-card">
                    <h3>Leads por Fuente</h3>
                    {leadsBySource.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={leadsBySource}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {leadsBySource.map((entry, index) => (
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

                <div className="chart-card">
                    <h3>Embudo de Conversión</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={funnelData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#2563eb" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Widgets Section */}
            <div className="widgets-grid">
                <div className="widget-card">
                    <h3>Últimas Oportunidades</h3>
                    {recentOpportunities.length > 0 ? (
                        <div className="opportunities-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Cliente</th>
                                        <th>Vehículo</th>
                                        <th>Stage</th>
                                        <th>Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentOpportunities.map((opp) => (
                                        <tr
                                            key={opp.id}
                                            onClick={() => navigate(`/crm/opportunities/${opp.id}`)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{opp.customer_name || 'N/A'}</td>
                                            <td>{opp.car_info || 'N/A'}</td>
                                            <td>
                                                <span className={`stage-badge stage-${opp.stage}`}>
                                                    {opp.stage}
                                                </span>
                                            </td>
                                            <td>${opp.estimated_value?.toLocaleString() || '0'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="no-data">No hay oportunidades recientes</p>
                    )}
                </div>

                <div className="widget-card">
                    <h3>Tareas del Día</h3>
                    {todayTasks.length > 0 ? (
                        <div className="tasks-list">
                            {todayTasks.map((task) => (
                                <div key={task.id} className="task-item">
                                    <input
                                        type="checkbox"
                                        checked={task.status === 'completed'}
                                        onChange={() => handleCompleteTask(task.id)}
                                    />
                                    <div className="task-content">
                                        <p className="task-title">{task.title}</p>
                                        <div className="task-meta">
                                            <Clock size={14} />
                                            <span>{new Date(task.due_date).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}</span>
                                            {task.customer_name && <span>• {task.customer_name}</span>}
                                        </div>
                                    </div>
                                    {getPriorityBadge(task.priority)}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="no-data">No hay tareas para hoy</p>
                    )}
                </div>
            </div>

            {/* Activities Feed */}
            <div className="activities-feed">
                <h3>Actividades Recientes</h3>
                {recentActivities.length > 0 ? (
                    <div className="timeline">
                        {recentActivities.map((activity) => (
                            <div key={activity.id} className="timeline-item">
                                <div className="timeline-icon">
                                    {getActivityIcon(activity.activity_type)}
                                </div>
                                <div className="timeline-content">
                                    <p className="timeline-subject">{activity.subject}</p>
                                    <p className="timeline-meta">
                                        {activity.customer_name} • {activity.created_by_name} • {getTimeAgo(activity.created_at)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">No hay actividades recientes</p>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
