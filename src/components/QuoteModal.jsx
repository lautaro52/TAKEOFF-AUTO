import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronDown, ChevronUp, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { API_CONFIG } from '../config';
import { userService } from '../services/userService';
import './QuoteModal.css';

const QuoteModal = ({ isOpen, onClose }) => {
    const fileInputRef = useRef(null);
    const [formExpanded, setFormExpanded] = useState(true);
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        marca: '',
        año: '',
        modelo: '',
        version: '',
        kilometraje: '',
        email: '',
        condicion: '',
        caracteristicas: [],
        mejoras: [],
        otroCaracteristica: '',
        otraMejora: ''
    });
    const [photos, setPhotos] = useState([]);
    const [previews, setPreviews] = useState([]);

    useEffect(() => {
        if (isOpen) {
            const currentUser = userService.getCurrentUser();
            if (currentUser) {
                setFormData(prev => ({
                    ...prev,
                    email: currentUser.email || ''
                }));
            }
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Limit to 10 photos
        const newPhotos = [...photos, ...files].slice(0, 10);
        setPhotos(newPhotos);

        // Create previews
        const newPreviews = newPhotos.map(file => URL.createObjectURL(file));
        setPreviews(newPreviews);
    };

    const removePhoto = (index) => {
        const newPhotos = photos.filter((_, i) => i !== index);
        const newPreviews = previews.filter((_, i) => i !== index);

        // Revoke the URL to avoid memory leaks
        URL.revokeObjectURL(previews[index]);

        setPhotos(newPhotos);
        setPreviews(newPreviews);
    };

    const toggleCaracteristica = (item) => {
        setFormData(prev => ({
            ...prev,
            caracteristicas: prev.caracteristicas.includes(item)
                ? prev.caracteristicas.filter(i => i !== item)
                : [...prev.caracteristicas, item]
        }));
    };

    const toggleMejora = (item) => {
        setFormData(prev => ({
            ...prev,
            mejoras: prev.mejoras.includes(item)
                ? prev.mejoras.filter(i => i !== item)
                : [...prev.mejoras, item]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const data = new FormData();

            // Append basic info
            Object.keys(formData).forEach(key => {
                if (Array.isArray(formData[key])) {
                    data.append(key, JSON.stringify(formData[key]));
                } else {
                    data.append(key, formData[key]);
                }
            });

            // Append photos
            photos.forEach((photo, index) => {
                data.append('photos[]', photo);
            });

            const response = await fetch(`${API_CONFIG.BASE_URL}/submit_quote.php`, {
                method: 'POST',
                body: data
            });

            const result = await response.json();

            if (result.success) {
                setSubmitted(true);
                setTimeout(() => {
                    onClose();
                    setSubmitted(false);
                    setFormData({
                        marca: '', año: '', modelo: '', version: '', kilometraje: '',
                        email: '', condicion: '', caracteristicas: [], mejoras: [],
                        otroCaracteristica: '', otraMejora: ''
                    });
                    setPhotos([]);
                    setPreviews([]);
                }, 3000);
            } else {
                alert('Error al enviar la cotización: ' + result.message);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('Error de conexión con el servidor.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="quote-modal-overlay" onClick={onClose}>
            <div className="quote-modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="quote-modal-close" onClick={onClose}>
                    <X size={24} />
                </button>

                <div className="quote-modal-header">
                    <h2>COTIZÁ <span className="highlight-red">TU AUTO</span></h2>
                    <p>Completá los datos de tu vehículo</p>
                </div>

                {submitted ? (
                    <div className="quote-success-message">
                        <div className="success-icon">✓</div>
                        <h3>¡Cotización enviada!</h3>
                        <p>Te contactaremos pronto a tu correo electrónico.</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="quote-form-section">
                            <div
                                className="quote-form-header"
                                onClick={() => setFormExpanded(!formExpanded)}
                            >
                                <span>Formulario de consulta</span>
                                {formExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {formExpanded && (
                                <div className="quote-form-body">
                                    <div className="quote-form-grid">
                                        <input
                                            type="text"
                                            name="marca"
                                            placeholder="*Marca"
                                            value={formData.marca}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="año"
                                            placeholder="*Año"
                                            value={formData.año}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="modelo"
                                            placeholder="*Modelo"
                                            value={formData.modelo}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="version"
                                            placeholder="*Versión"
                                            value={formData.version}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="text"
                                            name="kilometraje"
                                            placeholder="*Kilometraje"
                                            value={formData.kilometraje}
                                            onChange={handleInputChange}
                                            required
                                        />
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="*Correo electrónico"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>

                                    <div className="quote-form-field">
                                        <label>Indicá la condición actual de su vehículo</label>
                                        <select
                                            name="condicion"
                                            value={formData.condicion}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">—Por favor, elegí una opción—</option>
                                            <option value="excelente">Excelente</option>
                                            <option value="muy-bueno">Muy bueno</option>
                                            <option value="bueno">Bueno</option>
                                            <option value="regular">Regular</option>
                                            <option value="necesita-reparacion">Necesita reparación</option>
                                        </select>
                                    </div>

                                    <div className="quote-form-field">
                                        <label>Seleccioná las características adicionales que tiene su vehículo</label>
                                        <div className="quote-checkbox-grid">
                                            {['GNC', 'Polarizado', 'Cámara trasera', 'Sensores de estacionamiento', 'Pantalla multimedia', 'Alarma'].map(item => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={`quote-checkbox-btn ${formData.caracteristicas.includes(item) ? 'active' : ''}`}
                                                    onClick={() => toggleCaracteristica(item)}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="quote-form-field">
                                        <label>Otro ¿Cuál?</label>
                                        <div className="quote-input-with-button">
                                            <input
                                                type="text"
                                                name="otroCaracteristica"
                                                value={formData.otroCaracteristica}
                                                onChange={handleInputChange}
                                            />
                                            <button type="button" className="quote-add-btn">AGREGAR</button>
                                        </div>
                                    </div>

                                    <div className="quote-form-field">
                                        <label>¿Le has realizado mejoras recientemente? ¿Cuáles?</label>
                                        <div className="quote-checkbox-grid">
                                            {['Distribución', 'Tren delantero', 'Embrague', 'Cambio de neumáticos', 'Frenos', 'Cambio de aceite'].map(item => (
                                                <button
                                                    key={item}
                                                    type="button"
                                                    className={`quote-checkbox-btn ${formData.mejoras.includes(item) ? 'active' : ''}`}
                                                    onClick={() => toggleMejora(item)}
                                                >
                                                    {item}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="quote-form-field">
                                        <label>Otro ¿Cuál?</label>
                                        <div className="quote-input-with-button">
                                            <input
                                                type="text"
                                                name="otraMejora"
                                                value={formData.otraMejora}
                                                onChange={handleInputChange}
                                            />
                                            <button type="button" className="quote-add-btn">AGREGAR</button>
                                        </div>
                                    </div>

                                    <div className="quote-form-field">
                                        <label>Adjuntar fotos de tu vehículo (Máx. 10)</label>
                                        <div
                                            className="quote-upload-area"
                                            onClick={() => fileInputRef.current.click()}
                                        >
                                            <Upload size={32} />
                                            <span>Hacé clic para subir fotos</span>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                multiple
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                style={{ display: 'none' }}
                                            />
                                        </div>

                                        {previews.length > 0 && (
                                            <div className="quote-previews-grid">
                                                {previews.map((preview, index) => (
                                                    <div key={index} className="quote-preview-item">
                                                        <img src={preview} alt={`Preview ${index}`} />
                                                        <button
                                                            type="button"
                                                            className="remove-photo"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                removePhoto(index);
                                                            }}
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    <div className="quote-form-submit">
                                        <button
                                            type="submit"
                                            className="quote-submit-btn"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <><Loader2 className="animate-spin" size={20} /> Enviando...</>
                                            ) : 'Cotizar'}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default QuoteModal;
