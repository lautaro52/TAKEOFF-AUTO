import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { crmStockSync } from '../../services/crmService';
import { API_CONFIG } from '../../config';
import { RefreshCw, Search, Loader2, Image, AlertTriangle, CheckCircle, Package, ExternalLink, ChevronUp, ChevronDown, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './CRM.css';

const CRMStock = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [syncLog, setSyncLog] = useState([]);
    const [syncStats, setSyncStats] = useState(null);
    const [processingPhoto, setProcessingPhoto] = useState(null);
    const [bulkSorting, setBulkSorting] = useState(false);
    const [bulkProgress, setBulkProgress] = useState({ current: 0, total: 0 });
    const [sortConfig, setSortConfig] = useState({ key: 'brand', direction: 'asc' });

    const fetchCars = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_CONFIG.BASE_URL}/cars_test.php`);
            const data = await res.json();
            if (data.success) {
                setCars(data.data || []);
            }
        } catch (e) { console.error(e); }
        setLoading(false);
    }, []);

    useEffect(() => { fetchCars(); }, [fetchCars]);

    const handleSync = async () => {
        setSyncing(true);
        setSyncLog(['⏳ Iniciando sincronización con el inventario maestro...']);
        setSyncStats(null);
        try {
            const res = await crmStockSync.sync(false);
            if (res.success) {
                setSyncLog(res.log || ['✅ Sincronización finalizada correctamente.']);
                setSyncStats(res.stats);
                fetchCars();
            } else {
                setSyncLog([`❌ Error detectado: ${res.message}`, ...(res.log || [])]);
            }
        } catch (e) {
            setSyncLog([`❌ Error crítico de conexión: ${e.message}`]);
        }
        setSyncing(false);
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedAndFilteredCars = useMemo(() => {
        let result = cars.filter(car =>
            `${car.brand} ${car.model} ${car.domain} ${car.year}`.toLowerCase().includes(search.toLowerCase())
        );

        if (sortConfig.key) {
            result.sort((a, b) => {
                let aVal, bVal;

                switch (sortConfig.key) {
                    case 'name':
                        aVal = `${a.brand} ${a.model}`.toLowerCase();
                        bVal = `${b.brand} ${b.model}`.toLowerCase();
                        break;
                    case 'km':
                        aVal = Number(a.km) || 0;
                        bVal = Number(b.km) || 0;
                        break;
                    case 'price':
                        aVal = Number(a.price) || 0;
                        bVal = Number(b.price) || 0;
                        break;
                    case 'status':
                        aVal = (a.status || '').toLowerCase();
                        bVal = (b.status || '').toLowerCase();
                        break;
                    case 'domain':
                        aVal = (a.domain || '').toLowerCase();
                        bVal = (b.domain || '').toLowerCase();
                        break;
                    case 'year':
                        aVal = Number(a.year) || 0;
                        bVal = Number(b.year) || 0;
                        break;
                    default:
                        aVal = (a[sortConfig.key] || '').toString().toLowerCase();
                        bVal = (b[sortConfig.key] || '').toString().toLowerCase();
                }

                if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
                if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [cars, search, sortConfig]);

    const SortIcon = ({ column }) => {
        if (sortConfig.key !== column) return null;
        return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
    };

    const handleReorderPhotos = async (carId) => {
        if (processingPhoto) return;
        setProcessingPhoto(carId);
        try {
            const res = await crmStockSync.reorderPhotos(carId);
            if (res.success) {
                await fetchCars();
                return true;
            } else {
                alert(res.message || 'Error al reordenar fotos');
                return false;
            }
        } catch (err) {
            console.error(err);
            alert('Error de conexión');
            return false;
        } finally {
            setProcessingPhoto(null);
        }
    };

    const handleBulkReorder = async () => {
        const unsortedCars = cars.filter(c => !c.photos_sorted && c.has_photos && c.has_photos !== '0');
        if (unsortedCars.length === 0) {
            alert('Todos los vehículos ya están ordenados.');
            return;
        }

        if (!confirm(`Se procesarán ${unsortedCars.length} vehículos con IA. ¿Continuar?`)) return;

        setBulkSorting(true);
        setBulkProgress({ current: 0, total: unsortedCars.length });
        setSyncLog([`🤖 Iniciando ordenamiento masivo de ${unsortedCars.length} vehículos...`]);

        for (let i = 0; i < unsortedCars.length; i++) {
            const car = unsortedCars[i];
            setBulkProgress(prev => ({ ...prev, current: i + 1 }));
            setSyncLog(prev => [...prev, `📸 Analizando: ${car.brand} ${car.model}...`]);

            const success = await handleReorderPhotos(car.id);
            if (!success) {
                setSyncLog(prev => [...prev, `❌ Error en ${car.brand} ${car.model}. Continuando...`]);
            }
        }

        setSyncLog(prev => [...prev, '✨ Ordenamiento masivo completado.']);
        setBulkSorting(false);
        setSyncStats(prev => ({ ...prev, sorted: unsortedCars.length }));
    };

    if (loading && cars.length === 0) {
        return (
            <div className="crm-loading">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={32} />
                </motion.div>
                Cargando inventario...
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="crm-stock-page"
        >
            <div className="crm-page-header">
                <div>
                    <h1>Inventario de Vehículos</h1>
                    <p>{cars.length} unidades registradas en total</p>
                </div>
                <div style={{ display: 'flex', gap: 12 }}>
                    <div className="crm-search">
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por marca, modelo o dominio..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button
                        className="crm-btn"
                        onClick={handleBulkReorder}
                        disabled={bulkSorting || syncing}
                        style={{
                            background: 'linear-gradient(135deg, #c084fc 0%, #9333ea 100%)',
                            color: 'white',
                            border: '1px solid rgba(255,255,255,0.1)',
                            boxShadow: '0 4px 15px rgba(147, 51, 234, 0.5), inset 0 0 10px rgba(255,255,255,0.2)',
                            fontWeight: 800,
                            letterSpacing: '0.02em'
                        }}
                    >
                        {bulkSorting ? <Loader2 size={18} className="crm-spinner" /> : <Sparkles size={18} />}
                        {bulkSorting ? `Ordenando (${bulkProgress.current}/${bulkProgress.total})` : 'Ordenar Todo con IA'}
                    </button>
                    <button className="crm-btn crm-btn-primary" onClick={handleSync} disabled={syncing || bulkSorting}>
                        {syncing ? <Loader2 size={18} className="crm-spinner" /> : <RefreshCw size={18} />}
                        {syncing ? 'Sincronizando...' : 'Actualizar Stock'}
                    </button>
                </div>
            </div>

            <AnimatePresence>
                {syncLog.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="crm-sync-progress"
                        style={{ background: 'var(--crm-card-bg)', border: '1px solid var(--crm-border)', borderRadius: 'var(--crm-radius)', padding: 24, marginBottom: 24, overflow: 'hidden' }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ background: syncing ? 'var(--crm-primary-light)' : 'rgba(16, 185, 129, 0.1)', padding: 10, borderRadius: 12 }}>
                                    {syncing ? <RefreshCw size={20} className="crm-spinner" color="var(--crm-primary)" /> : <CheckCircle size={20} color="var(--crm-success)" />}
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                                        {syncing ? 'Sincronizando Inventario...' : 'Sincronización Exitosa'}
                                    </h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--crm-text-muted)' }}>Sincronización con Google Sheets & AI</p>
                                </div>
                            </div>
                            <button className="crm-btn crm-btn-secondary" onClick={() => setSyncLog([])} style={{ padding: 8, height: 'auto' }}>
                                <X size={18} />
                            </button>
                        </div>

                        {syncStats && (
                            <div className="crm-kpi-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 20 }}>
                                <div className="crm-kpi-card" style={{ padding: 16 }}>
                                    <span className="kpi-label" style={{ color: 'var(--crm-success)', marginBottom: 4 }}>Nuevos</span>
                                    <span className="kpi-value" style={{ fontSize: '1.4rem', margin: 0 }}>+{syncStats.added}</span>
                                </div>
                                <div className="crm-kpi-card" style={{ padding: 16 }}>
                                    <span className="kpi-label" style={{ color: 'var(--crm-primary)', marginBottom: 4 }}>Actualizados</span>
                                    <span className="kpi-value" style={{ fontSize: '1.4rem', margin: 0 }}>{syncStats.updated}</span>
                                </div>
                                <div className="crm-kpi-card" style={{ padding: 16 }}>
                                    <span className="kpi-label" style={{ color: 'var(--crm-danger)', marginBottom: 4 }}>Removidos</span>
                                    <span className="kpi-value" style={{ fontSize: '1.4rem', margin: 0 }}>{syncStats.removed}</span>
                                </div>
                                {syncStats.no_photos > 0 && (
                                    <div className="crm-kpi-card" style={{ padding: 16 }}>
                                        <span className="kpi-label" style={{ color: 'var(--crm-warning)', marginBottom: 4 }}>Sin Fotos</span>
                                        <span className="kpi-value" style={{ fontSize: '1.4rem', margin: 0 }}>{syncStats.no_photos}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="crm-sync-log" style={{ background: 'rgba(0,0,0,0.2)', padding: 12, borderRadius: 12, fontSize: '0.85rem', fontFamily: 'monospace', color: 'var(--crm-text-muted)' }}>
                            {syncLog.map((line, i) => <p key={i} style={{ margin: '2px 0' }}>{line}</p>)}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="crm-stock-table-wrap">
                <table className="crm-stock-table">
                    <thead>
                        <tr>
                            <th style={{ width: 80 }}>Vista</th>
                            <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Vehículo <SortIcon column="name" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('domain')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Dominio <SortIcon column="domain" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('year')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Año <SortIcon column="year" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('km')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Km <SortIcon column="km" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Precio <SortIcon column="price" />
                                </div>
                            </th>
                            <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    Estado <SortIcon column="status" />
                                </div>
                            </th>
                            <th>Fotos</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence mode="popLayout">
                            {sortedAndFilteredCars.map((car, idx) => {
                                const hasPhotos = car.has_photos !== '0' && car.has_photos !== 0;
                                const imgSrc = car.images?.[0]
                                    ? (car.images[0].startsWith('http') ? car.images[0] : `${API_CONFIG.IMAGE_BASE_URL}${car.images[0]}`)
                                    : null;

                                return (
                                    <motion.tr
                                        layout
                                        key={car.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.005 }}
                                    >
                                        <td>
                                            {imgSrc ? (
                                                <img src={imgSrc} alt="" style={{ width: 60, height: 40, borderRadius: 8, objectFit: 'cover', border: '1px solid var(--crm-border)' }} />
                                            ) : (
                                                <div style={{ width: 60, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--crm-border)' }}>
                                                    <Image size={18} style={{ color: 'var(--crm-text-muted)' }} />
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                <strong style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{car.brand} {car.model}</strong>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--crm-text-muted)' }}>{car.specs}</span>
                                            </div>
                                        </td>
                                        <td style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.85rem' }}>
                                            <code style={{ background: 'var(--crm-border)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.85rem', color: '#fff' }}>
                                                {car.domain?.startsWith('virtual_') ? '0KM / DIRECTA' : (car.domain || 'N/A').toUpperCase()}
                                            </code>
                                        </td>
                                        <td>{car.year}</td>
                                        <td style={{ fontWeight: 600 }}>{car.km ? Number(car.km).toLocaleString('es-AR') : '—'}</td>
                                        <td>
                                            <span style={{ fontWeight: 800, color: 'var(--crm-primary)' }}>
                                                ${Number(car.price).toLocaleString('es-AR')}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={`crm-stock-badge ${car.status}`}>
                                                {car.status === 'disponible' ? 'Disponible' : car.status === 'vendido' ? 'Vendido' : car.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                {hasPhotos ? (
                                                    <>
                                                        <span style={{ color: car.photos_sorted ? 'var(--crm-success)' : 'var(--crm-text-muted)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            {car.photos_sorted ? <CheckCircle size={14} /> : <Image size={14} />}
                                                            {car.images?.length || 0}
                                                        </span>
                                                        <button
                                                            className="crm-btn-icon"
                                                            onClick={(e) => { e.stopPropagation(); handleReorderPhotos(car.id); }}
                                                            title={car.photos_sorted ? "Volver a ordenar con IA" : "Ordenar fotos con IA (Poner frente primero)"}
                                                            disabled={processingPhoto === car.id || bulkSorting}
                                                            style={{
                                                                padding: '6px',
                                                                background: car.photos_sorted ? 'rgba(16, 185, 129, 0.05)' : 'rgba(255,255,255,0.05)',
                                                                border: car.photos_sorted ? '1px solid var(--crm-success)' : '1px solid var(--crm-border)',
                                                                borderRadius: '8px',
                                                                color: car.photos_sorted ? 'var(--crm-success)' : 'var(--crm-primary)',
                                                                cursor: 'pointer',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center'
                                                            }}
                                                        >
                                                            {processingPhoto === car.id ? <Loader2 size={14} className="crm-spinner" /> : <Sparkles size={14} />}
                                                        </button>
                                                    </>
                                                ) : (
                                                    <span className="crm-stock-badge no-photos">
                                                        <AlertTriangle size={14} /> Sin foto
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </AnimatePresence>
                    </tbody>
                </table>
                {sortedAndFilteredCars.length === 0 && (
                    <div className="crm-empty" style={{ padding: '60px 0', textAlign: 'center', border: 'none' }}>
                        <Package size={48} style={{ color: 'var(--crm-border)', marginBottom: 16 }} />
                        <p style={{ color: 'var(--crm-text-muted)' }}>No se encontraron vehículos que coincidan con la búsqueda.</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default CRMStock;
