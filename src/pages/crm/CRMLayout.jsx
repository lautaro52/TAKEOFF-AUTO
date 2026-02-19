import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    TrendingUp,
    Activity,
    CheckSquare,
    Menu,
    X
} from 'lucide-react';
import Navbar from '../components/Navbar';
import { getOverdueTasks } from '../services/crmService';
import { getStoredUser } from '../services/authService';
import './CRMLayout.css';

const CRMLayout = () => {
    const location = useLocation();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [overdueCount, setOverdueCount] = useState(0);
    const user = getStoredUser();

    useEffect(() => {
        // Load overdue tasks count for badge
        const loadOverdueTasks = async () => {
            if (user) {
                try {
                    const response = await getOverdueTasks(user.id);
                    setOverdueCount(response.data.length);
                } catch (error) {
                    console.error('Error loading overdue tasks:', error);
                }
            }
        };

        loadOverdueTasks();
    }, [user]);

    const navItems = [
        { path: '/crm', icon: LayoutDashboard, label: 'Dashboard', exact: true },
        { path: '/crm/customers', icon: Users, label: 'Clientes' },
        { path: '/crm/opportunities', icon: TrendingUp, label: 'Oportunidades' },
        { path: '/crm/activities', icon: Activity, label: 'Actividades' },
        { path: '/crm/tasks', icon: CheckSquare, label: 'Tareas', badge: overdueCount }
    ];

    const isActive = (item) => {
        if (item.exact) {
            return location.pathname === item.path;
        }
        return location.pathname.startsWith(item.path);
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const segments = path.split('/').filter(Boolean);

        const breadcrumbs = [{ label: 'CRM', path: '/crm' }];

        if (segments.length > 1) {
            const section = segments[1];
            const sectionLabels = {
                'customers': 'Clientes',
                'opportunities': 'Oportunidades',
                'activities': 'Actividades',
                'tasks': 'Tareas'
            };

            if (sectionLabels[section]) {
                breadcrumbs.push({
                    label: sectionLabels[section],
                    path: `/crm/${section}`
                });
            }
        }

        return breadcrumbs;
    };

    return (
        <div className="crm-layout">
            <Navbar />

            <div className="crm-container">
                {/* Sidebar */}
                <aside className={`crm-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
                    <div className="sidebar-header">
                        <h2>CRM</h2>
                        <button
                            className="sidebar-toggle"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`nav-item ${isActive(item) ? 'active' : ''}`}
                                >
                                    <Icon size={20} />
                                    {sidebarOpen && (
                                        <>
                                            <span>{item.label}</span>
                                            {item.badge > 0 && (
                                                <span className="badge">{item.badge}</span>
                                            )}
                                        </>
                                    )}
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="crm-main">
                    {/* Breadcrumbs */}
                    <div className="breadcrumbs">
                        {getBreadcrumbs().map((crumb, index) => (
                            <React.Fragment key={crumb.path}>
                                {index > 0 && <span className="separator">/</span>}
                                <Link to={crumb.path} className="breadcrumb">
                                    {crumb.label}
                                </Link>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Page Content */}
                    <div className="crm-content">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default CRMLayout;
