import React, { useState, useEffect } from 'react';
import './Admin.css';
import { addCar, updateCar, deleteCar, listenToCars } from '../services/carsService';
import { API_CONFIG } from '../config';
import { X, Upload, Image as ImageIcon, Loader } from 'lucide-react';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    // Form states
    const [brand, setBrand] = useState('');
    const [model, setModel] = useState('');
    const [year, setYear] = useState('');
    const [price, setPrice] = useState('');
    const [specs, setSpecs] = useState('');
    const [km, setKm] = useState('');
    const [transmission, setTransmission] = useState('automatico');
    const [fuel, setFuel] = useState('gasolina');
    const [type, setType] = useState('sedan');
    const [color, setColor] = useState('blanco');
    const [city, setCity] = useState('');
    const [status, setStatus] = useState('disponible');
    const [featured, setFeatured] = useState(false);
    const [homeSection, setHomeSection] = useState('');

    // Images
    const [selectedImages, setSelectedImages] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]);

    // Management states
    const [cars, setCars] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    // Real-time listener for cars
    useEffect(() => {
        if (isLoggedIn) {
            const unsubscribe = listenToCars((carsData) => {
                setCars(carsData);
            });

            return () => unsubscribe();
        }
    }, [isLoggedIn]);

    const handleLogin = (e) => {
        e.preventDefault();
        // Login: takeoffauto / takeoffauto
        if (username === 'takeoffauto' && password === 'takeoffauto') {
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Credenciales incorrectas');
        }
    };

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);

        if (files.length + selectedImages.length > 15) {
            setError('Máximo 15 imágenes permitidas');
            return;
        }

        // Create previews
        const newPreviews = files.map(file => URL.createObjectURL(file));
        setImagePreviews([...imagePreviews, ...newPreviews]);
        setSelectedImages([...selectedImages, ...files]);
    };

    const removeImage = (index) => {
        const newImages = selectedImages.filter((_, i) => i !== index);
        const newPreviews = imagePreviews.filter((_, i) => i !== index);

        // Revoke old preview URL
        URL.revokeObjectURL(imagePreviews[index]);

        setSelectedImages(newImages);
        setImagePreviews(newPreviews);
    };

    const resetForm = () => {
        setBrand('');
        setModel('');
        setYear('');
        setPrice('');
        setSpecs('');
        setKm('');
        setTransmission('automatico');
        setFuel('gasolina');
        setType('sedan');
        setColor('blanco');
        setCity('');
        setStatus('disponible');
        setFeatured(false);
        setHomeSection('');
        setSelectedImages([]);
        setImagePreviews([]);
        setEditingId(null);

        // Revoke all preview URLs
        imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const carData = {
                brand,
                model,
                year: parseInt(year),
                price: parseInt(price),
                specs,
                km: parseInt(km),
                transmission,
                fuel,
                type,
                color,
                city,
                status,
                featured,
                home_section: homeSection || null
            };

            if (editingId) {
                await updateCar(editingId, carData, selectedImages.length > 0 ? selectedImages : null);
                setSuccessMessage('Auto actualizado exitosamente');
            } else {
                if (selectedImages.length === 0) {
                    setError('Debes seleccionar al menos 1 imagen');
                    setLoading(false);
                    return;
                }
                await addCar(carData, selectedImages);
                setSuccessMessage('Auto agregado exitosamente');
            }

            resetForm();
        } catch (err) {
            setError('Error al guardar el auto: ' + err.message);
        } finally {
            setLoading(false);
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 3000);
        }
    };

    const handleEdit = (car) => {
        setBrand(car.brand);
        setModel(car.model);
        setYear(car.year.toString());
        setPrice(car.price.toString());
        setSpecs(car.specs || '');
        setKm(car.km?.toString() || '');
        setTransmission(car.transmission || 'automatico');
        setFuel(car.fuel || 'gasolina');
        setType(car.type || 'sedan');
        setColor(car.color || 'blanco');
        setCity(car.city || '');
        setStatus(car.status || 'disponible');
        setFeatured(car.featured || false);
        setHomeSection(car.home_section || '');
        setEditingId(car.id);

        // Load existing images as previews (these are URLs from database)
        if (car.images && car.images.length > 0) {
            // Convert URLs to full paths
            const imageUrls = car.images.map(img =>
                img.startsWith('http') ? img : `${API_CONFIG.IMAGE_BASE_URL}${img}`
            );
            setImagePreviews(imageUrls);
            setSelectedImages([]); // Clear selected files
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id, carName) => {
        if (window.confirm(`¿Estás seguro de eliminar "${carName}"? Esto eliminará todas sus imágenes.`)) {
            setLoading(true);
            try {
                await deleteCar(id);
                setSuccessMessage('Auto eliminado exitosamente');
            } catch (err) {
                setError('Error al eliminar: ' + err.message);
            } finally {
                setLoading(false);
                setTimeout(() => {
                    setSuccessMessage('');
                    setError('');
                }, 3000);
            }
        }
    };

    const filteredCars = cars.filter(car =>
        car.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        car.year?.toString().includes(searchTerm)
    );

    if (!isLoggedIn) {
        return (
            <div className="admin-login-container">
                <div className="login-card">
                    <div className="welcome-banner">
                        <h1>BIENVENIDO EMPLEADO DE TAKEOFF AUTO</h1>
                    </div>
                    <h2>Admin Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Usuario</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Contraseña</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit" className="btn-login-submit">Ingresar</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <h2>Panel de Administración - TAKE OFF AUTO</h2>
                    <button onClick={() => setIsLoggedIn(false)} className="btn-logout">Cerrar Sesión</button>
                </div>

                {successMessage && <div className="success-banner">{successMessage}</div>}
                {error && <div className="error-banner">{error}</div>}

                {/* Form */}
                <div className="inventory-form-container">
                    <h3>{editingId ? 'Editar Auto' : 'Agregar Nuevo Auto'}</h3>
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Marca *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: Mazda"
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Modelo *</label>
                                <input
                                    type="text"
                                    placeholder="Ej: CX-5"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Año *</label>
                                <input
                                    type="number"
                                    placeholder="2023"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    required
                                    min="2000"
                                    max="2025"
                                />
                            </div>
                            <div className="form-group">
                                <label>Precio *</label>
                                <input
                                    type="number"
                                    placeholder="390999"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Kilometraje *</label>
                                <input
                                    type="number"
                                    placeholder="15000"
                                    value={km}
                                    onChange={(e) => setKm(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group full-width">
                            <label>Especificaciones *</label>
                            <input
                                type="text"
                                placeholder="Ej: 2.5 S Grand Touring • AWD • Automático"
                                value={specs}
                                onChange={(e) => setSpecs(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Tipo *</label>
                                <select value={type} onChange={(e) => setType(e.target.value)}>
                                    <option value="sedan">Sedán</option>
                                    <option value="suv">SUV</option>
                                    <option value="hatchback">Hatchback</option>
                                    <option value="pickup">Pickup</option>
                                    <option value="coupe">Coupe</option>
                                    <option value="convertible">Convertible</option>
                                    <option value="van">Van</option>
                                    <option value="wagon">Wagon</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Transmisión *</label>
                                <select value={transmission} onChange={(e) => setTransmission(e.target.value)}>
                                    <option value="automatico">Automático</option>
                                    <option value="manual">Manual</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Combustible *</label>
                                <select value={fuel} onChange={(e) => setFuel(e.target.value)}>
                                    <option value="gasolina">Gasolina</option>
                                    <option value="diesel">Diesel</option>
                                    <option value="hibrido">Híbrido</option>
                                    <option value="electrico">Eléctrico</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Color *</label>
                                <select value={color} onChange={(e) => setColor(e.target.value)}>
                                    <option value="blanco">Blanco</option>
                                    <option value="negro">Negro</option>
                                    <option value="gris">Gris</option>
                                    <option value="rojo">Rojo</option>
                                    <option value="azul">Azul</option>
                                    <option value="amarillo">Amarillo</option>
                                    <option value="cafe">Café</option>
                                    <option value="beige">Beige</option>
                                    <option value="dorado">Dorado</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Ciudad *</label>
                                <input
                                    type="text"
                                    placeholder="Córdoba Capital"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Estado *</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="disponible">Disponible</option>
                                    <option value="apartado">Apartado</option>
                                    <option value="vendido">Vendido</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={featured}
                                    onChange={(e) => setFeatured(e.target.checked)}
                                />
                                <span>Destacar en página principal</span>
                            </label>
                        </div>

                        <div className="form-group">
                            <label>Sección en Home (Opcional)</label>
                            <select value={homeSection} onChange={(e) => setHomeSection(e.target.value)}>
                                <option value="">Ninguna</option>
                                <option value="vendidos">Los más vendidos</option>
                                <option value="destacados">Destacados del catálogo</option>
                            </select>
                            <small style={{ display: 'block', marginTop: '5px', color: '#666' }}>
                                Si seleccionas una sección, el auto aparecerá en la fila correspondiente en Home.
                            </small>
                        </div>

                        {/* Image Upload */}
                        <div className="image-upload-section">
                            <label>Imágenes (Máximo 15) *</label>
                            <div className="upload-area">
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageSelect}
                                    id="image-input"
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="image-input" className="upload-button">
                                    <Upload size={24} />
                                    <span>Seleccionar imágenes</span>
                                    <small>{selectedImages.length}/15 imágenes seleccionadas</small>
                                </label>
                            </div>

                            {imagePreviews.length > 0 && (
                                <div className="image-previews">
                                    {imagePreviews.map((preview, index) => (
                                        <div key={index} className="image-preview">
                                            <img src={preview} alt={`Preview ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-image"
                                                onClick={() => removeImage(index)}
                                            >
                                                <X size={16} />
                                            </button>
                                            {index === 0 && <span className="primary-badge">Principal</span>}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="form-actions">
                            <button type="submit" className="btn-submit" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader className="spin" size={18} />
                                        {editingId ? 'Actualizando...' : 'Guardando...'}
                                    </>
                                ) : (
                                    editingId ? 'Actualizar Auto' : 'Agregar Auto'
                                )}
                            </button>
                            {editingId && (
                                <button type="button" className="btn-cancel" onClick={resetForm}>
                                    Cancelar
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Car List */}
                <div className="car-list-section">
                    <div className="list-header">
                        <h3>Autos en Inventario ({cars.length})</h3>
                        <input
                            type="text"
                            placeholder="Buscar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    {filteredCars.length === 0 ? (
                        <div className="empty-state">
                            <ImageIcon size={48} />
                            <p>No hay autos en el inventario</p>
                        </div>
                    ) : (
                        <div className="admin-car-grid">
                            {filteredCars.map((car) => (
                                <div key={car.id} className="admin-car-card">
                                    {car.status === 'apartado' && <span className="badge-reserved">Apartado</span>}
                                    {car.featured && <span className="badge-featured">⭐ Destacado</span>}
                                    <div className="admin-car-image">
                                        <img
                                            src={car.images?.[0]?.startsWith('http')
                                                ? car.images[0]
                                                : `${API_CONFIG.IMAGE_BASE_URL}${car.images?.[0]}`
                                            }
                                            alt={`${car.brand} ${car.model}`}
                                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image' }}
                                        />
                                    </div>
                                    <div className="admin-car-info">
                                        <h4>{car.brand} {car.model}</h4>
                                        <p className="car-specs-small">{car.year} • {car.specs}</p>
                                        <p className="car-price-small">${Number(car.price).toLocaleString('es-AR', { maximumFractionDigits: 0 })}{Number(car.price) < 100000 ? ' USD' : ''}</p>
                                        <p className="car-images-count">{car.images?.length || 0} imágenes</p>
                                        {car.home_section && (
                                            <span className="badge-tag" style={{
                                                fontSize: '0.75rem',
                                                background: '#e3f2fd',
                                                color: '#1976d2',
                                                padding: '2px 8px',
                                                borderRadius: '4px',
                                                display: 'inline-block',
                                                marginTop: '5px'
                                            }}>
                                                🏷️ {car.home_section === 'vendidos' ? 'Más Vendido' :
                                                    car.home_section === 'destacados' ? 'Destacado' : car.home_section}
                                            </span>
                                        )}
                                    </div>
                                    <div className="admin-action-buttons">
                                        <button className="btn-edit-small" onClick={() => handleEdit(car)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-delete-small" onClick={() => handleDelete(car.id, `${car.brand} ${car.model}`)}>
                                            🗑️ Eliminar
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Admin;
