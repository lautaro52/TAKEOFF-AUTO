import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crmAuth } from '../../services/crmService';
import { Mail, Lock, Loader2 } from 'lucide-react';
import '../crm/CRM.css';

const CRMLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const result = await crmAuth.login(email, password);
            if (result.success) {
                navigate('/crm/gestion');
            } else {
                setError(result.message || 'Credenciales incorrectas');
            }
        } catch (err) {
            setError('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="crm-login-page">
            <div className="crm-login-card">
                <div className="crm-login-header">
                    <div className="crm-login-logo">
                        <span className="crm-logo-icon">🚀</span>
                        <h1>TAKEOFF CRM</h1>
                    </div>
                    <p>Panel de gestión administrativo</p>
                </div>
                <form onSubmit={handleSubmit} className="crm-login-form">
                    <div className="crm-input-group">
                        <Mail size={18} />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>
                    <div className="crm-input-group">
                        <Lock size={18} />
                        <input
                            type="password"
                            placeholder="Contraseña"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <div className="crm-login-error">{error}</div>}
                    <button type="submit" className="crm-login-btn" disabled={loading}>
                        {loading ? <Loader2 size={18} className="crm-spinner" /> : 'Ingresar'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CRMLogin;
