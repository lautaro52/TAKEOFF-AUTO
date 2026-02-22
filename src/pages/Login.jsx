import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, Fingerprint, ArrowRight, Loader2, Shield, MessageCircle, CheckCircle2, User } from 'lucide-react';
import { userService } from '../services/userService';
import { signInWithGoogleMock } from '../services/mockAuthService';
import Logo from '../components/Logo';
import './Login.css';

const GOOGLE_ICON = (
    <svg width="20" height="20" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.28-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
);

const Login = () => {
    const navigate = useNavigate();
    // ─── State ───────────────────────────────────────────────
    const [step, setStep] = useState(1); // 1 = Name/Email, 2 = DNI, 3 = WhatsApp
    const [authMethod, setAuthMethod] = useState(''); // 'form' | 'google'
    const [isLoginMode, setIsLoginMode] = useState(false);
    const [googleUser, setGoogleUser] = useState(null);

    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        whatsapp: '',
        dni: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ─── Handlers ────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target;
        // Solo números para WhatsApp y DNI
        if (name === 'whatsapp' || name === 'dni') {
            if (value && !/^\d*$/.test(value)) return;
        }
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Step 1: Form Continue
    const handleStep1Submit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLoginMode) {
            // Login path: Email + DNI required
            if (!formData.email || !formData.dni) {
                setError('Por favor ingresa tu email y DNI.');
                return;
            }

            setLoading(true);
            try {
                const user = await userService.login({
                    email: formData.email,
                    dni: formData.dni,
                    mode: 'login'
                });
                if (user) navigate('/panel');
            } catch (err) {
                setError(err.message || 'Error al iniciar sesión');
            } finally {
                setLoading(false);
            }
        } else {
            // Registration path
            if (!formData.full_name || !formData.email.includes('@')) {
                setError('Por favor ingresa tu nombre y un email válido.');
                return;
            }
            setAuthMethod('form');
            setStep(2);
        }
    };

    // Step 1: Google Continue
    const handleGoogleSignIn = async () => {
        try {
            setError('');
            setLoading(true);
            const result = await signInWithGoogleMock();
            setGoogleUser({
                email: result.user.email,
                displayName: result.user.displayName
            });
            setFormData(prev => ({
                ...prev,
                full_name: result.user.displayName,
                email: result.user.email
            }));
            setAuthMethod('google');
            setStep(2);
        } catch (err) {
            console.error('❌ Error Google:', err);
            setError('Error al ingresar con Google. Intenta de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: DNI Continue
    const handleStep2Submit = (e) => {
        e.preventDefault();
        if (formData.dni.length < 7) {
            setError('Por favor ingresa un DNI válido.');
            return;
        }
        setError('');
        setStep(3);
    };

    // Step 3: WhatsApp & Final Submit
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        if (formData.whatsapp.length < 8) {
            setError('Por favor ingresa un número de WhatsApp válido.');
            return;
        }

        try {
            setError('');
            setLoading(true);
            const payload = {
                ...formData,
                whatsapp: '+54' + formData.whatsapp,
                authProvider: authMethod
            };
            const user = await userService.login(payload);
            console.log('✅ Usuario registrado/logueado:', user);
            window.location.href = '/panel';
        } catch (err) {
            console.error('❌ Error final:', err);
            const msg = err.message || 'Error al completar el registro. Intenta de nuevo.';

            if (msg.toLowerCase().includes('registrado') || msg.toLowerCase().includes('inicie sesión')) {
                setError(
                    <div className="already-registered-error">
                        <p>{msg}</p>
                        <button
                            type="button"
                            className="btn-switch-login"
                            onClick={() => {
                                setStep(1);
                                setIsLoginMode(true);
                                setError('');
                            }}
                        >
                            Ir a Iniciar Sesión
                        </button>
                    </div>
                );
            } else {
                setError(msg);
            }
        } finally {
            setLoading(false);
        }
    };

    // ─── Multi-step Renderer ─────────────────────────────────
    const renderSteps = () => (
        <div className="login-stepper">
            {/* Progress bar */}
            <div className="stepper-progress">
                <div className="stepper-track">
                    <div className="stepper-fill" style={{ width: `${((step - 1) / 2) * 100}%` }} />
                </div>
                <div className="stepper-dots">
                    {[1, 2, 3].map(s => (
                        <div key={s} className={`stepper-dot ${s < step ? 'done' : ''} ${s === step ? 'active' : ''}`}>
                            {s < step ? <CheckCircle2 size={16} /> : s}
                        </div>
                    ))}
                </div>
                <div className="stepper-labels">
                    <span className={step >= 2 ? 'done' : step === 1 ? 'active' : ''}>Ingreso</span>
                    <span className={step >= 3 ? 'done' : step === 2 ? 'active' : ''}>DNI</span>
                    <span className={step === 3 ? 'active' : ''}>WhatsApp</span>
                </div>
            </div>

            {authMethod === 'google' && googleUser && (
                <div className="google-welcome">
                    <div className="google-avatar">
                        {googleUser.displayName?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="google-welcome-text">
                        <span className="google-name">{googleUser.displayName}</span>
                        <span className="google-email">{googleUser.email}</span>
                    </div>
                </div>
            )}

            {step === 1 && (
                <div className="step-form">
                    <h1 className="login-title">
                        {isLoginMode ? 'Bienvenido de nuevo' : 'Bienvenido a TAKEOFF AUTO'}
                    </h1>
                    <p className="login-subtitle">
                        {isLoginMode
                            ? 'Ingresa tu email para acceder a tu panel.'
                            : 'Ingresa tus datos para acceder a tu panel personalizado y ver tus favoritos.'}
                    </p>
                    <form className="login-form" onSubmit={handleStep1Submit}>
                        <div className="input-group-premium">
                            <label className="input-label">Email</label>
                            <div className="input-with-icon">
                                <Mail size={18} className="input-icon" />
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="premium-input"
                                    required
                                />
                            </div>
                        </div>

                        {!isLoginMode && (
                            <div className="input-group-premium">
                                <label className="input-label">Nombre Completo</label>
                                <div className="input-with-icon">
                                    <User size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="full_name"
                                        placeholder="Tu nombre completo"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="premium-input"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {isLoginMode && (
                            <div className="input-group-premium">
                                <label className="input-label">DNI</label>
                                <div className="input-with-icon">
                                    <Fingerprint size={18} className="input-icon" />
                                    <input
                                        type="text"
                                        name="dni"
                                        placeholder="Tu número de DNI"
                                        value={formData.dni}
                                        onChange={handleChange}
                                        className="premium-input"
                                        required
                                    />
                                </div>
                            </div>
                        )}

                        {error && <div className="error-message-premium-container">{error}</div>}
                        <button type="submit" className="btn-continue-premium active" disabled={loading}>
                            {loading ? (
                                <Loader2 className="spinner" size={18} />
                            ) : (
                                <>
                                    <span>{isLoginMode ? 'Entrar' : 'Continuar'}</span>
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="mode-toggle-text">
                        {isLoginMode ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                        <button
                            className="mode-toggle-btn"
                            onClick={() => {
                                setIsLoginMode(!isLoginMode);
                                setError('');
                            }}
                        >
                            {isLoginMode ? 'Créala aquí' : 'Inicia sesión'}
                        </button>
                    </p>

                    <div className="login-divider"><span>o</span></div>

                    <button className="btn-google" onClick={handleGoogleSignIn} disabled={loading}>
                        {GOOGLE_ICON}
                        <span>Continuar con Google</span>
                    </button>
                </div>
            )}

            {step === 2 && (
                <form className="step-form" onSubmit={handleStep2Submit}>
                    <div className="step-info">
                        <Shield size={28} className="step-info-icon" />
                        <h2 className="step-title">Verificación de identidad</h2>
                        <p className="step-description">
                            Necesitamos tu <strong>DNI</strong> para la <strong>precalificación crediticia</strong>.
                            Esto nos permite ofrecerte los mejores planes de financiación.
                        </p>
                    </div>
                    <div className="input-group-premium">
                        <label className="input-label">Número de DNI</label>
                        <div className="input-with-icon">
                            <Fingerprint size={18} className="input-icon" />
                            <input
                                type="text"
                                name="dni"
                                placeholder="Ej: 35678901"
                                value={formData.dni}
                                onChange={handleChange}
                                className="premium-input"
                                autoFocus
                            />
                        </div>
                    </div>
                    {error && <div className="error-message-premium-container">{error}</div>}
                    <button
                        type="submit"
                        className={`btn-continue-premium ${formData.dni.length >= 7 ? 'active' : ''}`}
                        disabled={formData.dni.length < 7}
                    >
                        <span>Continuar</span>
                        <ArrowRight size={18} />
                    </button>
                </form>
            )}

            {step === 3 && (
                <form className="step-form" onSubmit={handleFinalSubmit}>
                    <div className="step-info">
                        <MessageCircle size={28} className="step-info-icon" />
                        <h2 className="step-title">Contacto directo</h2>
                        <p className="step-description">
                            Ingresá tu <strong>WhatsApp</strong> para que un agente especializado (o nuestro bot) se comunique
                            contigo <strong>de inmediato</strong>.
                        </p>
                    </div>
                    <div className="input-group-premium">
                        <label className="input-label">WhatsApp</label>
                        <div className="input-with-prefix">
                            <span className="phone-prefix">+54</span>
                            <input
                                type="tel"
                                name="whatsapp"
                                placeholder="11 2345 6789"
                                value={formData.whatsapp}
                                onChange={handleChange}
                                className="premium-input with-prefix"
                                autoFocus
                            />
                        </div>
                    </div>
                    {error && <div className="error-message-premium-container">{error}</div>}
                    <button
                        type="submit"
                        className={`btn-continue-premium ${formData.whatsapp.length >= 8 ? 'active' : ''}`}
                        disabled={formData.whatsapp.length < 8 || loading}
                    >
                        {loading ? (
                            <Loader2 className="spinner" />
                        ) : (
                            <>
                                <span>Finalizar</span>
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );

    // ─── Render ──────────────────────────────────────────────
    return (
        <div className="login-page">
            <main className="login-main">
                <div className="login-card-k">
                    <div className="login-logo-wrapper">
                        <Logo width={140} />
                    </div>

                    {renderSteps()}

                    <p className="login-terms">
                        Al continuar confirmas que aceptas nuestros <a href="#terminos">Términos y Condiciones</a> y <a href="#privacidad">Políticas de Privacidad</a>.
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
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Login;
