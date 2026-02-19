import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Logo from '../components/Logo';
import './Login.css';

const Login = () => {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'email'

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/crm/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setPhoneNumber(value);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/crm/dashboard');
        } catch (err) {
            console.error('Login error:', err);
            setError(err.message || 'Error al iniciar sesión. Verifica tus credenciales.');
        } finally {
            setLoading(false);
        }
    };

    const handlePhoneLogin = () => {
        // Placeholder for phone login logic
        alert('El login con celular estará disponible pronto. Por favor usa email por ahora.');
        setLoginMethod('email');
    };

    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-card-k">
                    <h1 className="login-title">
                        {loginMethod === 'phone' ? '¡Sigue tu viaje! Ingresa con tu celular' : 'Iniciar Sesión'}
                    </h1>
                    <p className="login-subtitle">
                        Crea tu cuenta o inicia sesión para disfrutar de una experiencia personalizada.
                    </p>

                    {loginMethod === 'phone' ? (
                        <>
                            <div className="phone-input-container">
                                <div className="country-selector">
                                    <img
                                        src="https://flagcdn.com/w20/ar.png"
                                        alt="Argentina"
                                        className="country-flag-icon"
                                    />
                                    <span className="country-code">(+54 9)</span>
                                    <ChevronDown size={18} className="chevron-icon" />
                                </div>
                                <input
                                    type="tel"
                                    placeholder="Número de celular"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    className="phone-input"
                                />
                            </div>

                            <button
                                className={`btn-continue ${phoneNumber.length === 10 ? 'active' : ''}`}
                                disabled={phoneNumber.length !== 10}
                                onClick={handlePhoneLogin}
                            >
                                Continuar
                            </button>
                        </>
                    ) : (
                        <form onSubmit={handleEmailLogin} className="email-login-form">
                            <div className="form-group">
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    placeholder="Contraseña"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="login-input"
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn-continue active"
                                disabled={loading}
                            >
                                {loading ? 'Ingresando...' : 'Ingresar'}
                            </button>
                        </form>
                    )}

                    <div className="login-divider">
                        <span>o</span>
                    </div>

                    {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

                    <button
                        className="btn-text-only"
                        onClick={() => setLoginMethod(loginMethod === 'phone' ? 'email' : 'phone')}
                    >
                        {loginMethod === 'phone' ? 'Usar email y contraseña' : 'Usar número de celular'}
                    </button>

                    <p className="login-terms">
                        Al hacer clic en "Continuar" confirmo que he leído y acepto los <a href="#terminos">Términos y Condiciones</a> y <a href="#privacidad">Aviso de Privacidad</a> de TAKEOFF AUTO.
                    </p>
                </div>
            </main>

            <footer className="login-footer">
                <div className="container">
                    <div className="footer-bottom-l">
                        <div className="footer-logo-legal">
                            <Logo width={100} />
                            <span className="copyright">Copyright © 2026 TAKEOFF AUTO. Todos los derechos reservados</span>
                        </div>
                        <div className="footer-links-l">
                            <a href="#privacidad">Políticas de Privacidad</a>
                            <span className="separator">•</span>
                            <a href="#terminos">Términos y Condiciones</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
