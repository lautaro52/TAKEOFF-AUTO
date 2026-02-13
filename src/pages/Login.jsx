import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { signInWithGoogleMock } from '../services/mockAuthService';
import Logo from '../components/Logo';
import './Login.css';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setPhoneNumber(value);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            setError('');
            setLoading(true);

            const result = await signInWithGoogleMock();
            console.log('✅ Usuario logueado:', result.user);

            // Show success message
            alert(`¡Bienvenido, ${result.user.displayName}! 🎉\n\nInicio de sesión exitoso.`);

            // You can redirect here or update app state
            // window.location.href = '/';

        } catch (err) {
            console.error('❌ Error de login:', err);
            setError('Error al iniciar sesión. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-card-k">
                    <h1 className="login-title">¡Sigue tu viaje! Ingresa con tu celular</h1>
                    <p className="login-subtitle">
                        Crea tu cuenta o inicia sesión para disfrutar de una experiencia personalizada.
                    </p>

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
                    >
                        Continuar
                    </button>

                    <div className="login-divider">
                        <span>o</span>
                    </div>

                    {error && <p className="error-message" style={{ color: 'red', marginBottom: '10px', fontSize: '14px' }}>{error}</p>}

                    <button
                        className="btn-google-login"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="google-icon"
                        />
                        <span>{loading ? 'Iniciando sesión...' : 'Iniciar sesión con Google'}</span>
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
