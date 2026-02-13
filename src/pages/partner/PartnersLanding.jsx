import React, { useState } from 'react';
import { partnerService } from '../../services/leadService';
import './PartnersLanding.css';

const PartnersLanding = () => {
    const [formData, setFormData] = useState({
        full_name: '',
        whatsapp: '',
        password: '',
        cbu_alias: '',
        residence_zone: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await partnerService.register(formData);
            if (res.success) {
                setMessage('¡Registro exitoso! Próximamente recibirás acceso.');
                // Redirigir o limpiar formulario
            } else {
                setMessage('Error: ' + (res.message || 'Error en el registro'));
            }
        } catch (error) {
            setMessage('Error de conexión');
        }
        setLoading(false);
    };

    const scrollToForm = () => {
        document.getElementById('register-form').scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="partners-landing">
            <section className="partners-hero">
                <h1>Tu Cartera de Contactos es tu Capital</h1>

                <div className="video-container">
                    {/* Reemplazar con el video final */}
                    <div className="video-placeholder">
                        <p>Video Explainer: "Usá mi stock, vendé desde tu celular, cobrá en el día"</p>
                    </div>
                </div>

                <button className="cta-button" onClick={scrollToForm}>
                    EMPEZAR A FACTURAR AHORA
                </button>
            </section>

            <section className="registration-section" id="register-form">
                <div className="glass-form">
                    <h2>Unite a Take Off</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Nombre Completo</label>
                            <input type="text" name="full_name" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>WhatsApp</label>
                            <input type="tel" name="whatsapp" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input type="password" name="password" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>CBU o Alias (para pagos)</label>
                            <input type="text" name="cbu_alias" required onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Zona de Residencia</label>
                            <input type="text" name="residence_zone" required onChange={handleChange} />
                        </div>

                        {message && <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>{message}</div>}

                        <button type="submit" className="submit-btn" disabled={loading}>
                            {loading ? 'REGISTRANDO...' : 'REGISTRARME COMO PARTNER'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
};

export default PartnersLanding;
