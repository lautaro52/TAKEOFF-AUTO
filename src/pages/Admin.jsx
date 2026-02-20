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
    const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'bulk'

    // Bulk upload states
    const [bulkFolders, setBulkFolders] = useState([]); // Array of { name, files, specs, images }
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0, status: '' });

    // Parser for ficha_tecnica.txt
    const parseFichaTecnica = (content) => {
        const specs = {};
        const lines = content.split('\n');

        // Extraction patterns based on ingest_cars.cjs
        const priceMatch = content.match(/Precio: \$([0-9.]+)/);
        const kmMatch = content.match(/Kilometraje: ([0-9]+)/);
        const yearMatch = content.match(/Año: ([0-9]+)/);

        lines.forEach(line => {
            const match = line.match(/• (.*?): (.*)/);
            if (match) {
                specs[match[1].trim()] = match[2].trim();
            }
        });

        // Map to DB fields
        const fuelMap = { 'Nafta': 'gasolina', 'Diesel': 'diesel', 'Híbrido': 'hibrido', 'Eléctrico': 'electrico', 'GNC': 'gasolina' };
        const typeMap = { 'Sedán': 'sedan', 'SUV': 'suv', 'Hatchback': 'hatchback', 'Pickup': 'pickup', 'Cupé': 'coupe', 'Convertible': 'convertible', 'Van': 'van', 'Wagon': 'wagon' };

        let length = 0, height = 0, width = 0;
        const dimMatch = (specs['Largo x Altura x Ancho'] || '').match(/([0-9]+) mm x ([0-9]+) mm x ([0-9]+) mm/);
        if (dimMatch) {
            length = parseInt(dimMatch[1]);
            height = parseInt(dimMatch[2]);
            width = parseInt(dimMatch[3]);
        }

        return {
            brand: specs['Marca'] || '',
            model: specs['Modelo'] || '',
            version: specs['Versión'] || '',
            year: yearMatch ? parseInt(yearMatch[1]) : (specs['Año'] ? parseInt(specs['Año']) : 0),
            price: priceMatch ? parseInt(priceMatch[1].replace(/\./g, '')) : 0,
            km: kmMatch ? parseInt(kmMatch[1]) : (specs['Kilómetros'] ? parseInt(specs['Kilómetros'].replace(/\D/g, '')) : 0),
            specs: specs['Versión'] || `${specs['Marca']} ${specs['Modelo']}`,
            transmission: (specs['Transmisión'] || '').toLowerCase().includes('auto') ? 'automatico' : 'manual',
            fuel: fuelMap[specs['Tipo de combustible']] || 'gasolina',
            type: typeMap[specs['Tipo de carrocería']] || 'sedan',
            color: specs['Color'] || 'blanco',
            engine_size: specs['Motor'] || '',
            horsepower: specs['Potencia'] || '',
            valves_per_cylinder: parseInt(specs['Válvulas por cilindro'] || 0),
            length_mm: length,
            width_mm: width,
            height_mm: height,
            wheelbase_mm: parseInt((specs['Distancia entre ejes'] || '0').replace(/\D/g, '')),
            fuel_tank_liters: parseInt((specs['Capacidad del tanque'] || '0').replace(/\D/g, '')),
            abs_brakes: specs['Frenos ABS'] === 'Sí' ? 1 : 0,
            airbags: (specs['Airbag para conductor y pasajero'] === 'Sí' || specs['Airbag'] === 'Sí') ? 'Conductor y pasajero' : 'No',
            cruise_control: specs['Piloto automático'] === 'Sí' ? 1 : 0,
            air_conditioning: specs['Aire acondicionado'] === 'Sí' ? 1 : 0,
            onboard_computer: specs['Computadora de abordo'] === 'Sí' ? 1 : 0,
            cup_holders: specs['Porta vasos'] === 'Sí' ? 1 : 0,
            steering_type: specs['Dirección'] || '',
            traction_control: specs['Control de tracción'] || '',
            am_fm_radio: specs['AM/FM'] === 'Sí' ? 1 : 0,
            bluetooth: specs['Bluetooth'] === 'Sí' ? 1 : 0,
            mp3_player: specs['Reproductor de MP3'] === 'Sí' ? 1 : 0,
            doors: parseInt((specs['Puertas'] || '0').replace(/\D/g, '')),
            passengers: parseInt((specs['Capacidad de personas'] || '0').replace(/\D/g, '')),
            city: 'Córdoba Capital',
            status: 'disponible',
            featured: false
        };
    };

    const handleFolderSelect = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        // Group files by parent directory
        const foldersMap = {};
        files.forEach(file => {
            // file.webkitRelativePath looks like "Folder/Sub/file.jpg"
            const parts = file.webkitRelativePath.split('/');
            const folderName = parts[0];
            if (!foldersMap[folderName]) foldersMap[folderName] = { name: folderName, files: [], specsFile: null, images: [] };

            foldersMap[folderName].files.push(file);
            if (file.name.toLowerCase() === 'ficha_tecnica.txt') {
                foldersMap[folderName].specsFile = file;
            } else if (file.type.startsWith('image/')) {
                foldersMap[folderName].images.push(file);
            }
        });

        const folderList = Object.values(foldersMap).filter(f => f.specsFile);
        setBulkFolders(folderList);
    };

    const handleBulkUpload = async () => {
        if (bulkFolders.length === 0) return;
        setLoading(true);
        setError('');
        setBulkProgress({ current: 0, total: bulkFolders.length, status: 'Iniciando carga...' });

        try {
            for (let i = 0; i < bulkFolders.length; i++) {
                const folder = bulkFolders[i];
                setBulkProgress(prev => ({ ...prev, current: i + 1, status: `Procesando: ${folder.name}` }));

                // 1. Read and parse specs
                const content = await folder.specsFile.text();
                const carData = parseFichaTecnica(content);

                // 2. Add car and images
                if (carData.brand && carData.model) {
                    await addCar(carData, folder.images);
                } else {
                    console.warn(`Saltando carpeta ${folder.name}: Datos incompletos`);
                }
            }
            setSuccessMessage(`Se han cargado ${bulkFolders.length} autos exitosamente.`);
            setBulkFolders([]);
        } catch (err) {
            setError('Error en carga masiva: ' + err.message);
        } finally {
            setLoading(false);
            setBulkProgress({ current: 0, total: 0, status: '' });
            setTimeout(() => {
                setSuccessMessage('');
                setError('');
            }, 5000);
        }
    };

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

                {/* Tabs - Disabled */}
                <div className="admin-tabs" style={{ opacity: 0.5, pointerEvents: 'none' }}>
                    <button className="admin-tab">📝 Carga Manual (Bloqueado)</button>
                    <button className="admin-tab">📁 Carga Masiva (Bloqueado)</button>
                </div>

                <div className="locked-notice" style={{
                    background: '#fff3e0',
                    border: '1px solid #ffe0b2',
                    padding: '20px',
                    borderRadius: '8px',
                    marginBottom: '30px',
                    textAlign: 'center',
                    color: '#e65100'
                }}>
                    <h3>⚠️ Catálogo Bloqueado</h3>
                    <p>El catálogo se ha restringido a las 90 unidades actuales. Las funciones de carga, edición y eliminación han sido desactivadas temporalmente para mantener la integridad del inventario seleccionado.</p>
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
                                        <p style={{ fontSize: '0.85rem', color: '#666', fontStyle: 'italic' }}>Información de lectura</p>
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
