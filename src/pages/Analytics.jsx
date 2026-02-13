import React, { useState, useEffect } from 'react';
import { getPopularModels, getLocationInsights } from '../services/analyticsService';
import './Analytics.css';

const Analytics = () => {
    const [popularModels, setPopularModels] = useState([]);
    const [locationInsights, setLocationInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(30);
    const [selectedCity, setSelectedCity] = useState('');

    useEffect(() => {
        loadAnalyticsData();
    }, [days, selectedCity]);

    const loadAnalyticsData = async () => {
        setLoading(true);
        try {
            const options = { days };
            if (selectedCity) {
                options.city = selectedCity;
            }

            const [models, locations] = await Promise.all([
                getPopularModels(options),
                getLocationInsights(days)
            ]);

            setPopularModels(models);
            setLocationInsights(locations);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const cities = [...new Set(locationInsights.map(l => l.city))].filter(Boolean);

    return (
        <div className="analytics-page">
            <div className="analytics-container">
                <header className="analytics-header">
                    <h1>📊 Análisis de Búsquedas</h1>
                    <p>Insights sobre qué modelos buscan los usuarios en tu región</p>
                </header>

                <div className="analytics-filters">
                    <div className="filter-group">
                        <label>Período:</label>
                        <select value={days} onChange={(e) => setDays(parseInt(e.target.value))}>
                            <option value={7}>Últimos 7 días</option>
                            <option value={30}>Últimos 30 días</option>
                            <option value={90}>Últimos 90 días</option>
                            <option value={365}>Último año</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Ciudad:</label>
                        <select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)}>
                            <option value="">Todas las ciudades</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </div>

                    <button onClick={loadAnalyticsData} className="refresh-btn">
                        🔄 Actualizar
                    </button>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <p>Cargando datos...</p>
                    </div>
                ) : (
                    <>
                        {/* Popular Models Section */}
                        <section className="analytics-section">
                            <h2>🔥 Modelos Más Buscados</h2>
                            {popularModels.length === 0 ? (
                                <p className="no-data">No hay datos suficientes para este período.</p>
                            ) : (
                                <div className="popular-models-grid">
                                    {popularModels.map((model, index) => (
                                        <div key={index} className="model-card">
                                            <div className="model-rank">#{index + 1}</div>
                                            <div className="model-info">
                                                <h3>{model.brand} {model.model}</h3>
                                                <p className="model-type">{model.type}</p>
                                            </div>
                                            <div className="model-stats">
                                                <div className="stat">
                                                    <span className="stat-value">{model.search_count}</span>
                                                    <span className="stat-label">búsquedas</span>
                                                </div>
                                                <div className="stat">
                                                    <span className="stat-value">{model.days_searched}</span>
                                                    <span className="stat-label">días</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Location Insights Section */}
                        <section className="analytics-section">
                            <h2>📍 Insights por Ubicación</h2>
                            {locationInsights.length === 0 ? (
                                <p className="no-data">No hay datos de ubicación para este período.</p>
                            ) : (
                                <div className="location-insights">
                                    {locationInsights.map((location, index) => (
                                        <div key={index} className="location-card">
                                            <div className="location-header">
                                                <h3>{location.city}</h3>
                                                {location.region && <span className="region-badge">{location.region}</span>}
                                            </div>
                                            <div className="location-stats">
                                                <p className="total-searches">
                                                    <strong>{location.total_searches}</strong> búsquedas totales
                                                </p>
                                            </div>
                                            <div className="top-models">
                                                <h4>Top modelos preferidos:</h4>
                                                <ul>
                                                    {location.top_models.map((model, idx) => (
                                                        <li key={idx}>
                                                            <span className="model-name">
                                                                {model.brand} {model.model}
                                                            </span>
                                                            <span className="model-count">
                                                                {model.search_count} búsquedas
                                                            </span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Quick Stats */}
                        <section className="analytics-section">
                            <h2>📈 Estadísticas Rápidas</h2>
                            <div className="quick-stats">
                                <div className="stat-card">
                                    <div className="stat-icon">🔍</div>
                                    <div className="stat-info">
                                        <h3>{popularModels.reduce((sum, m) => sum + m.search_count, 0)}</h3>
                                        <p>Búsquedas totales</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">🚗</div>
                                    <div className="stat-info">
                                        <h3>{popularModels.length}</h3>
                                        <p>Modelos únicos buscados</p>
                                    </div>
                                </div>
                                <div className="stat-card">
                                    <div className="stat-icon">📍</div>
                                    <div className="stat-info">
                                        <h3>{locationInsights.length}</h3>
                                        <p>Ciudades con búsquedas</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </>
                )}
            </div>
        </div>
    );
};

export default Analytics;
