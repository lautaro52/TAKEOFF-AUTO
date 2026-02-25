import React, { useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { crmAuth } from '../../services/crmService';
import { Users, BarChart3, Package, LogOut } from 'lucide-react';
import './CRM.css';

const CRMLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!crmAuth.isLoggedIn()) {
            navigate('/crm');
        }
    }, [navigate]);

    const admin = crmAuth.getAdmin();

    const handleLogout = () => {
        crmAuth.logout();
        navigate('/crm');
    };

    const navItems = [
        { path: '/crm/gestion', label: 'Gestión', icon: Users },
        { path: '/crm/dashboard', label: 'Dashboard', icon: BarChart3 },
        { path: '/crm/stock', label: 'Stock', icon: Package },
    ];

    if (!crmAuth.isLoggedIn()) return null;

    return (
        <div className="crm-layout">
            <aside className="crm-sidebar">
                <div className="crm-sidebar-header">
                    <span className="crm-sidebar-logo">🚀</span>
                    <div>
                        <h2>TAKEOFF</h2>
                        <span className="crm-sidebar-subtitle">CRM</span>
                    </div>
                </div>

                <nav className="crm-nav">
                    {navItems.map(item => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`crm-nav-item ${location.pathname === item.path ? 'active' : ''}`}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="crm-sidebar-footer">
                    <div className="crm-admin-info">
                        <div className="crm-admin-avatar">{admin?.full_name?.charAt(0) || 'A'}</div>
                        <div>
                            <p className="crm-admin-name">{admin?.full_name || 'Admin'}</p>
                            <p className="crm-admin-role">{admin?.role || 'admin'}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} className="crm-logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>
            </aside>

            <main className="crm-main">
                {children}
            </main>
        </div>
    );
};

export default CRMLayout;
