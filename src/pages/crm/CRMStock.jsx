import React, { useState, useEffect, useCallback } from 'react';
import { crmStockSync } from '../../services/crmService';
import { API_CONFIG } from '../../config';
import { RefreshCw, Search, Loader2, Image, AlertTriangle, CheckCircle, Package } from 'lucide-react';
import './CRM.css';

const CRMStock = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [syncing, setSyncing] = useState(false);
    const [syncLog, setSyncLog] = useState([]);
    const [syncStats, setSyncStats] = useState(null);

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
        setSyncLog(['⏳ Iniciando sincronización con proveedor...']);
        setSyncStats(null);
        try {
            const res = await crmStockSync.sync();
            if (res.success) {
                setSyncLog(res.log || ['✅ Sync completado']);
                setSyncStats(res.stats);
                fetchCars(); // Refresh car list
            } else {
                setSyncLog([`❌ Error: ${res.message}`, ...(res.log || [])]);
            }
        } catch (e) {
            setSyncLog([`❌ Error de conexión: ${e.message}`]);
        }
        setSyncing(false);
    };

    const filteredCars = cars.filter(car =>
        car.brand?.toLowerCase().includes(search.toLowerCase()) ||
        car.model?.toLowerCase().includes(search.toLowerCase()) ||
        car.domain?.toLowerCase().includes(search.toLowerCase()) ||
        car.year?.toString().includes(search)
    );

    const carsWithPhotos = cars.filter(c => c.has_photos !== '0' && c.has_photos !== 0);
    const carsWithoutPhotos = cars.filter(c => c.has_photos === '0' || c.has_photos === 0);

    return (
        <div className="crm-stock-page">
            <div className="crm-page-header">
                <div>
                    <h1>Gestión de Stock</h1>
                    <p>{cars.length} vehículos ({carsWithPhotos.length} con fotos, {carsWithoutPhotos.length} sin fotos)</p>
                </div>
                <div className="crm-header-actions">
                    <div className="crm-search">
                        <Search size={16} color="#8a96a8" />
                        <input
                            type="text"
                            placeholder="Buscar vehículo..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button className="crm-btn crm-btn-primary" onClick={handleSync} disabled={syncing}>
                        {syncing ? <Loader2 size={16} className="crm-spinner" /> : <RefreshCw size={16} />}
                        {syncing ? 'Sincronizando...' : 'Sincronizar Stock'}
                    </button>
                </div>
            </div>

            {/* Sync progress */}
            {syncLog.length > 0 && (
                <div className="crm-sync-progress">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        {syncing ? <Loader2 size={18} className="crm-spinner" color="#2161f2" /> : <CheckCircle size={18} color="#10b981" />}
                        <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                            {syncing ? 'Sincronización en progreso...' : 'Sincronización completada'}
                        </h3>
                    </div>
                    {syncStats && (
                        <div style={{ display: 'flex', gap: 16, marginBottom: 12, flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 600 }}>+{syncStats.added} nuevos</span>
                            <span style={{ fontSize: '0.85rem', color: '#2161f2', fontWeight: 600 }}>~{syncStats.updated} actualizados</span>
                            <span style={{ fontSize: '0.85rem', color: '#ef4444', fontWeight: 600 }}>-{syncStats.removed} removidos</span>
                            {syncStats.no_photos > 0 && <span style={{ fontSize: '0.85rem', color: '#f59e0b', fontWeight: 600 }}>📷 {syncStats.no_photos} sin fotos</span>}
                            {syncStats.ai_generated > 0 && <span style={{ fontSize: '0.85rem', color: '#8b5cf6', fontWeight: 600 }}>🤖 {syncStats.ai_generated} fichas IA</span>}
                        </div>
                    )}
                    <div className="crm-sync-log">
                        {syncLog.map((line, i) => <p key={i}>{line}</p>)}
                    </div>
                </div>
            )}

            {/* Stock table */}
            {loading ? (
                <div className="crm-loading"><Loader2 size={20} className="crm-spinner" /> Cargando stock...</div>
            ) : (
                <div className="crm-stock-table-wrap">
                    <table className="crm-stock-table">
                        <thead>
                            <tr>
                                <th>Foto</th>
                                <th>Vehículo</th>
                                <th>Dominio</th>
                                <th>Año</th>
                                <th>Precio</th>
                                <th>Km</th>
                                <th>Estado</th>
                                <th>Fotos</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCars.length === 0 ? (
                                <tr>
                                    <td colSpan="8">
                                        <div className="crm-empty"><Package size={32} /><p>No se encontraron vehículos</p></div>
                                    </td>
                                </tr>
                            ) : (
                                filteredCars.map(car => {
                                    const hasPhotos = car.has_photos !== '0' && car.has_photos !== 0;
                                    const imgSrc = car.images?.[0]
                                        ? (car.images[0].startsWith('http') ? car.images[0] : `${API_CONFIG.IMAGE_BASE_URL}${car.images[0]}`)
                                        : null;
                                    return (
                                        <tr key={car.id}>
                                            <td>
                                                {imgSrc ? (
                                                    <img src={imgSrc} alt="" className="car-thumb" onError={(e) => { e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect fill="%23f0f2f5" width="60" height="40"/><text x="30" y="24" text-anchor="middle" fill="%238a96a8" font-size="10">📷</text></svg>' }} />
                                                ) : (
                                                    <div style={{ width: 60, height: 40, borderRadius: 8, background: '#f0f2f5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                        <Image size={16} color="#8a96a8" />
                                                    </div>
                                                )}
                                            </td>
                                            <td>
                                                <strong>{car.brand} {car.model}</strong>
                                                <br /><span style={{ fontSize: '0.78rem', color: '#8a96a8' }}>{car.specs}</span>
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontSize: '0.85rem' }}>{car.domain || '—'}</td>
                                            <td>{car.year}</td>
                                            <td style={{ fontWeight: 600 }}>${Number(car.price).toLocaleString('es-AR')}</td>
                                            <td>{car.km ? Number(car.km).toLocaleString('es-AR') + ' km' : '—'}</td>
                                            <td>
                                                <span className={`crm-stock-badge ${car.status}`}>
                                                    {car.status === 'disponible' ? 'Disponible' : car.status === 'vendido' ? 'Vendido' : car.status}
                                                </span>
                                            </td>
                                            <td>
                                                {hasPhotos ? (
                                                    <span style={{ color: '#10b981', fontSize: '0.8rem' }}>✅ {car.images?.length || 0}</span>
                                                ) : (
                                                    <span className="crm-stock-badge no-photos">
                                                        <AlertTriangle size={10} /> Sin foto
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CRMStock;
