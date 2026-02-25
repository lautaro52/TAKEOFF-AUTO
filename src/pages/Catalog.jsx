import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, ChevronUp, MapPin, Heart, ArrowRight, Loader2, Filter, X } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { listenToCars } from '../services/carsService';
import { userService } from '../services/userService';
import { carBrands } from '../data/carsData';
import { API_CONFIG, USD_QUOTATION } from '../config';
import { syncDealershipInventory } from '../services/syncService';
import './Catalog.css';

// getNormalizedPrice removed, functionality moved to carsService.js as car.arsPrice

const COLOR_MAPPING = {
    'gris plata': 'plateado',
    'gris oscuro': 'gris',
    'gris claro': 'gris',
    'plata': 'plateado',
    'marron': 'cafe',
    'marrón': 'cafe',
    'bronce': 'dorado',
    'crema': 'beige',
    'arena': 'beige'
};

const FUEL_MAPPING = {
    'gasolina': 'nafta',
    'bencina': 'nafta'
};

const MASTER_COLORS = [
    { id: 'amarillo', name: 'Amarillo', hex: '#FFD700' },
    { id: 'azul', name: 'Azul', hex: '#0066FF' },
    { id: 'beige', name: 'Beige', hex: '#D4C5B9' },
    { id: 'blanco', name: 'Blanco', hex: '#FFFFFF' },
    { id: 'cafe', name: 'Café', hex: '#6F4E37' },
    { id: 'dorado', name: 'Dorado', hex: '#D4AF37' },
    { id: 'gris', name: 'Gris', hex: '#808080' },
    { id: 'negro', name: 'Negro', hex: '#000000' },
    { id: 'plateado', name: 'Plateado', hex: '#C0C0C0' },
    { id: 'rojo', name: 'Rojo', hex: '#DC143C' },
    { id: 'naranja', name: 'Naranja', hex: '#FF8C00' },
    { id: 'verde', name: 'Verde', hex: '#228B22' }
];

const formatCurrencyInput = (val) => {
    if (val === undefined || val === null || val === '') return '';
    const numericValue = val.toString().replace(/\D/g, '');
    if (!numericValue) return '';
    return '$ ' + Number(numericValue).toLocaleString('es-AR');
};

const parseCurrencyInput = (val) => {
    if (!val) return '';
    return val.toString().replace(/\D/g, '');
};

const Catalog = () => {
    // Cars from database
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [syncStatus, setSyncStatus] = useState(null);

    // State for user and favorites
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]); // List of car IDs
    const [showLoginPrompt, setShowLoginPrompt] = useState(false);

    const syncStock = useCallback(async () => {
        if (syncing) return;
        setSyncStatus(null);
        setSyncing(true);

        try {
            const { cars: syncedCars, meta } = await syncDealershipInventory(cars, {
                forceRefresh: true,
                generateDescriptions: true,
                includeDescriptions: true
            });

            setCars(syncedCars);
            setSyncStatus({
                type: 'success',
                message: `Stock sincronizado: ${meta.matched} de ${meta.total} unidades actualizadas.`
            });
        } catch (error) {
            console.error('Error during stock sync:', error);
            setSyncStatus({
                type: 'error',
                message: error.message || 'No se pudo sincronizar el stock con la concesionaria.'
            });
        } finally {
            setSyncing(false);
        }
    }, [cars, syncing]);

    // Load user and favorites on mount

    // Load user and favorites on mount
    useEffect(() => {
        const currentUser = userService.getCurrentUser();
        setUser(currentUser);

        if (currentUser) {
            userService.getActivities().then(data => {
                if (data.success) {
                    setFavorites(data.favorites.map(f => f.id));
                }
            }).catch(err => console.error('Error fetching favorites:', err));
        }
    }, []);

    const handleFavoriteClick = async (e, carId) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            setShowLoginPrompt(true);
            return;
        }

        const isFavorite = favorites.includes(carId);
        try {
            const result = await userService.toggleFavorite(carId, isFavorite);
            if (result.success) {
                setFavorites(prev =>
                    isFavorite ? prev.filter(id => id !== carId) : [...prev, carId]
                );
            }
        } catch (error) {
            console.error('Error toggling favorite:', error);
        }
    };

    // Price filter states

    // Price filter states
    const [priceMin, setPriceMin] = useState('');
    const [priceMax, setPriceMax] = useState('');
    const [absMinPrice, setAbsMinPrice] = useState(0);
    const [absMaxPrice, setAbsMaxPrice] = useState(0);
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [selectedTransmission, setSelectedTransmission] = useState([]);
    const [selectedColors, setSelectedColors] = useState([]);
    const [searchBrand, setSearchBrand] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('recent');

    // Collapsible sections state
    const [openSections, setOpenSections] = useState({
        price: false,
        brand: false,
        mechanical: false,
        color: false
    });

    // Load cars from database with real-time updates
    useEffect(() => {
        let isMounted = true;

        const unsubscribe = listenToCars((carsData) => {
            if (isMounted) {
                setCars(carsData);
                setLoading(false);

                // Calculate min and max prices dynamically (normalized to ARS)
                if (carsData.length > 0) {
                    const normalizedPrices = carsData.map(car => car.arsPrice).filter(p => p > 0);
                    if (normalizedPrices.length > 0) {
                        const min = Math.floor(Math.min(...normalizedPrices));
                        const max = Math.ceil(Math.max(...normalizedPrices));
                        setAbsMaxPrice(max);
                    }
                }
            }
        });

        // Set a timeout to clear loading if it takes too long
        const timeout = setTimeout(() => {
            if (isMounted && loading) {
                setLoading(false);
            }
        }, 8000);

        return () => {
            isMounted = false;
            unsubscribe();
            clearTimeout(timeout);
        };
    }, []);

    const toggleSection = (section) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Filtered cars
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const filteredCars = useMemo(() => {
        return cars.filter(car => {
            // Price filter (on normalized values)
            const normalizedCarPrice = car.arsPrice;
            const min = priceMin ? parseInt(priceMin) : 0;
            const max = priceMax ? parseInt(priceMax) : Infinity;

            if (min && normalizedCarPrice < min && normalizedCarPrice !== 0) return false;
            if (max && normalizedCarPrice > max) return false;

            // Brand filter
            if (selectedBrands.length > 0) {
                const carBrand = car.brand?.toLowerCase();
                if (!selectedBrands.some(b => b.toLowerCase() === carBrand)) return false;
            }


            // Transmission filter
            if (selectedTransmission.length > 0) {
                const normalizedTrans = car.transmission?.toLowerCase();
                if (!selectedTransmission.includes(normalizedTrans)) return false;
            }

            // Color filter
            if (selectedColors.length > 0) {
                const raw = car.color?.toLowerCase();
                if (!raw) return false;
                const normalizedColor = COLOR_MAPPING[raw] || raw;
                if (!selectedColors.includes(normalizedColor)) return false;
            }

            // Search query filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const brand = car.brand?.toLowerCase() || '';
                const model = car.model?.toLowerCase() || '';
                const specs = car.specs?.toLowerCase() || '';

                if (!brand.includes(query) && !model.includes(query) && !specs.includes(query)) {
                    return false;
                }
            }

            return true;
        });
    }, [cars, priceMin, priceMax, selectedBrands, selectedTransmission, selectedColors, searchQuery]);

    // Sorted cars based on selected sort option
    const sortedCars = useMemo(() => {
        const sorted = [...filteredCars];

        const compareFn = (a, b) => {
            // Priority score:
            // 4: Featured/BestSellers with photo
            // 3: Used with photo
            // 2: 0km with photo
            // 1: Anything without photo (Send to end)
            const getPriority = (car) => {
                if (!car.hasPhotos) return 1;

                const isZero = Number(car.km) === 0 || car.home_section === '0km';
                const isFeatured = car.featured || car.home_section === 'destacados';

                if (isFeatured) return 4;
                if (!isZero) return 3;
                return 2;
            };

            const priorityA = getPriority(a);
            const priorityB = getPriority(b);

            if (priorityA !== priorityB) {
                return priorityB - priorityA; // Higher priority first
            }

            // Within same priority group, use selected sort
            switch (sortBy) {
                case 'price-asc': return a.arsPrice - b.arsPrice;
                case 'price-desc': return b.arsPrice - a.arsPrice;
                case 'year-desc': return Number(b.year) - Number(a.year);
                case 'km-asc': return Number(a.km) - Number(b.km);
                case 'recent':
                default: return Number(b.id) - Number(a.id);
            }
        };

        return sorted.sort((a, b) => compareFn(a, b));

    }, [filteredCars, sortBy]);

    // Pagination logic
    const totalPages = Math.ceil(sortedCars.length / itemsPerPage);
    const paginatedCars = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedCars.slice(start, start + itemsPerPage);
    }, [sortedCars, currentPage]);

    // Reset pagination on filter/sort change
    useEffect(() => {
        setCurrentPage(1);
    }, [filteredCars, sortBy]);



    const availableTransmissions = useMemo(() => {
        // Filter by available stock
        return [...new Set(cars
            .filter(car => car.status === 'disponible')
            .map(car => car.transmission?.toLowerCase())
            .filter(Boolean)
        )].sort();
    }, [cars]);

    // Track search analytics when filters change (debounced)
    useEffect(() => {
        // Import analytics service dynamically to avoid issues if not available
        const trackFilters = async () => {
            try {
                const { trackSearch } = await import('../services/analyticsService');

                // Only track if at least one filter is active
                const hasActiveFilters = priceMin || priceMax || selectedBrands.length > 0 ||
                    selectedTransmission.length > 0 || selectedColors.length > 0;

                if (hasActiveFilters) {
                    trackSearch({
                        priceMin,
                        priceMax,
                        selectedBrands,
                        selectedTransmission,
                        selectedColors
                    });
                }
            } catch (error) {
                // Silently fail - analytics should not break the app
                console.debug('Analytics tracking skipped:', error);
            }
        };

        // Debounce: only track after user stops changing filters for 2 seconds
        const debounceTimer = setTimeout(trackFilters, 2000);

        return () => clearTimeout(debounceTimer);
    }, [priceMin, priceMax, selectedBrands, selectedTransmission, selectedColors, searchQuery]);

    const toggleBrand = (brand) => {
        setSelectedBrands(prev =>
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    const toggleTransmission = (trans) => {
        setSelectedTransmission(prev =>
            prev.includes(trans) ? prev.filter(t => t !== trans) : [...prev, trans]
        );
    };

    const toggleColor = (color) => {
        setSelectedColors(prev =>
            prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
        );
    };


    const availableColors = useMemo(() => {
        const inStockColorIds = new Set();
        cars.forEach(car => {
            if (car.color && car.status === 'disponible') {
                const raw = car.color.toLowerCase();
                inStockColorIds.add(COLOR_MAPPING[raw] || raw);
            }
        });

        return MASTER_COLORS.filter(color => inStockColorIds.has(color.id));
    }, [cars]);

    // Get unique brands from cars in stock (available only)
    const availableBrandNames = useMemo(() => {
        const brands = new Set();
        cars.forEach(car => {
            if (car.brand && car.status === 'disponible') brands.add(car.brand);
        });
        return Array.from(brands).sort();
    }, [cars]);

    // Calculate price distribution (histogram)
    const histogramData = useMemo(() => {
        if (!cars.length || absMinPrice === absMaxPrice) return [];

        const binCount = 18; // Slightly fewer bins for better visual on sidebar
        const range = absMaxPrice - absMinPrice;
        const binSize = range / binCount;
        const bins = Array(binCount).fill(0).map((_, i) => ({
            min: Math.floor(absMinPrice + (i * binSize)),
            max: Math.floor(absMinPrice + ((i + 1) * binSize)),
            count: 0
        }));

        cars.forEach(car => {
            const price = car.arsPrice;
            if (price === 0) return;
            const binIndex = Math.min(
                Math.floor((price - absMinPrice) / binSize),
                binCount - 1
            );
            if (binIndex >= 0 && binIndex < binCount) {
                bins[binIndex].count++;
            }
        });

        const nonZeroBins = bins.filter(bin => bin.count > 0);
        const maxCount = Math.max(...nonZeroBins.map(b => b.count), 0);
        return nonZeroBins.map(bin => ({
            ...bin,
            height: maxCount > 0 ? (bin.count / maxCount) * 100 : 0
        }));
    }, [cars, absMinPrice, absMaxPrice]);

    const handleHistogramClick = (bin) => {
        setPriceMin(bin.min.toString());
        setPriceMax(bin.max.toString());
    };

    // Build dynamic brand data combining static list with active stock
    const dynamicBrandData = useMemo(() => {
        return availableBrandNames.map(brandName => {
            const staticInfo = carBrands.find(b => b.name.toLowerCase() === brandName.toLowerCase());
            return {
                name: brandName,
                logo: staticInfo?.logo || null,
                popular: staticInfo?.popular || false
            };
        });
    }, [availableBrandNames]);

    const activePopularBrands = useMemo(() => {
        return dynamicBrandData.filter(b => b.popular);
    }, [dynamicBrandData]);

    const activeFilteredBrands = useMemo(() => {
        return dynamicBrandData.filter(b =>
            b.name.toLowerCase().includes(searchBrand.toLowerCase())
        );
    }, [dynamicBrandData, searchBrand]);

    return (
        <div className="catalog-page">
            <div className="catalog-container">
                {/* Sidebar Filters */}
                <aside className="catalog-sidebar">


                    <div className="sidebar-header">
                        <div className="filters-top-header">
                            <h3 className="filters-title">Filtros</h3>
                            {(priceMin || priceMax || selectedBrands.length > 0 || selectedTransmission.length > 0 || selectedColors.length > 0 || searchQuery) && (
                                <button className="clear-filters-btn" onClick={() => {
                                    setPriceMin('');
                                    setPriceMax('');
                                    setSelectedBrands([]);
                                    setSelectedTransmission([]);
                                    setSelectedColors([]);
                                    setSearchQuery('');
                                }}>
                                    Limpiar
                                </button>
                            )}
                        </div>
                        <input
                            type="text"
                            placeholder="Busca marca o modelo..."
                            className="sidebar-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="filters-container">


                        {/* Price Filter */}
                        <div className="filter-section">
                            <button className="filter-header" onClick={() => toggleSection('price')}>
                                <span>Precio</span>
                                {openSections.price ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {openSections.price && (
                                <div className="filter-content">
                                    <div className="price-inputs">
                                        <div className="price-input-group">
                                            <label>Desde</label>
                                            <input
                                                type="text"
                                                placeholder={`$ ${absMinPrice.toLocaleString('es-AR')} `}
                                                value={formatCurrencyInput(priceMin)}
                                                onChange={(e) => setPriceMin(parseCurrencyInput(e.target.value))}
                                            />
                                        </div>
                                        <span className="price-separator">-</span>
                                        <div className="price-input-group">
                                            <label>Hasta</label>
                                            <input
                                                type="text"
                                                placeholder={`$ ${absMaxPrice.toLocaleString('es-AR')} `}
                                                value={formatCurrencyInput(priceMax)}
                                                onChange={(e) => setPriceMax(parseCurrencyInput(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                    <div className="price-histogram">
                                        {histogramData.map((bin, i) => (
                                            <div
                                                key={i}
                                                className={`histogram-bar ${parseInt(priceMin) === bin.min && parseInt(priceMax) === bin.max ? 'active' : ''}`}
                                                style={{ height: `${Math.max(bin.height, 5)}%` }}
                                                onClick={() => handleHistogramClick(bin)}
                                                title={`Rango: $${bin.min.toLocaleString()} - $${bin.max.toLocaleString()} (${bin.count} autos)`}
                                            ></div>
                                        ))}
                                    </div>
                                    <a href="#" className="price-ranges-link">Ver rangos de precios</a>
                                </div>
                            )}
                        </div>

                        {/* Brand Filter */}
                        <div className="filter-section">
                            <button className="filter-header" onClick={() => toggleSection('brand')}>
                                <span>Marca</span>
                                {openSections.brand ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {openSections.brand && (
                                <div className="filter-content">
                                    <input
                                        type="text"
                                        placeholder="Filtrar por marca"
                                        className="filter-search"
                                        value={searchBrand}
                                        onChange={(e) => setSearchBrand(e.target.value)}
                                    />
                                    <div className="brand-popular">
                                        <h4>Más populares</h4>
                                        <div className="brand-grid">
                                            {activePopularBrands.map(brand => (
                                                <button
                                                    key={brand.name}
                                                    className={`brand-card ${selectedBrands.includes(brand.name) ? 'active' : ''}`}
                                                    onClick={() => toggleBrand(brand.name)}
                                                >
                                                    {brand.logo && <img src={brand.logo} alt={brand.name} />}
                                                    <span>{brand.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="brand-list">
                                        <h4>Todas las marcas</h4>
                                        {activeFilteredBrands.map(brand => (
                                            <label key={brand.name} className="checkbox-label">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedBrands.includes(brand.name)}
                                                    onChange={() => toggleBrand(brand.name)}
                                                />
                                                <span>{brand.name}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Mechanical Filter */}
                        <div className="filter-section">
                            <button className="filter-header" onClick={() => toggleSection('mechanical')}>
                                <span>Mecánica</span>
                                {openSections.mechanical ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {openSections.mechanical && (
                                <div className="filter-content">
                                    <h4>Transmisión</h4>
                                    <div className="pill-group">
                                        {availableTransmissions.map(trans => (
                                            <button
                                                key={trans}
                                                className={`pill-btn ${selectedTransmission.includes(trans) ? 'active' : ''}`}
                                                onClick={() => toggleTransmission(trans)}
                                            >
                                                {trans.charAt(0).toUpperCase() + trans.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Color Filter */}
                        <div className="filter-section">
                            <button className="filter-header" onClick={() => toggleSection('color')}>
                                <span>Color exterior</span>
                                {openSections.color ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                            </button>
                            {openSections.color && (
                                <div className="filter-content">
                                    <div className="color-grid">
                                        {availableColors.map(color => (
                                            <button
                                                key={color.id}
                                                className={`color-card ${selectedColors.includes(color.id) ? 'active' : ''}`}
                                                onClick={() => toggleColor(color.id)}
                                            >
                                                <div
                                                    className="color-circle"
                                                    style={{
                                                        backgroundColor: color.hex,
                                                        border: color.id === 'blanco' ? '1px solid #ddd' : 'none'
                                                    }}
                                                ></div>
                                                <span>{color.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="catalog-main">
                    <div className="catalog-header">
                        <h2 className="results-count">{filteredCars.length.toLocaleString()} Resultados</h2>
                        <div className="catalog-actions">
                            <select
                                className="sort-select"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="recent">Más recientes</option>
                                <option value="price-asc">Precio: menor a mayor</option>
                                <option value="price-desc">Precio: mayor a menor</option>
                                <option value="year-desc">Año: más reciente</option>
                                <option value="km-asc">Kilometraje: menor</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="loading-state">
                            <p>Cargando autos...</p>
                        </div>
                    ) : filteredCars.length === 0 ? (
                        <div className="no-results">
                            <p>No se encontraron autos con los filtros seleccionados.</p>
                            <button className="clear-filters-btn" style={{ marginTop: '16px' }} onClick={() => {
                                setPriceMin('');
                                setPriceMax('');
                                setSelectedBrands([]);
                                setSelectedTransmission([]);
                                setSelectedColors([]);
                                setSearchQuery('');
                            }}>
                                Ver todos los vehículos
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="cars-grid">
                                {paginatedCars.map((car, index) => (
                                    <ProductCard key={car.id} car={car} />
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="pagination-container">
                                    <button
                                        className="pagination-btn"
                                        disabled={currentPage === 1}
                                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                    >
                                        &laquo;
                                    </button>

                                    {[...Array(totalPages)].map((_, i) => {
                                        const pageNum = i + 1;
                                        // Show first, last, current, and pages around current
                                        if (
                                            pageNum === 1 ||
                                            pageNum === totalPages ||
                                            (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
                                        ) {
                                            return (
                                                <button
                                                    key={pageNum}
                                                    className={`pagination-btn ${currentPage === pageNum ? 'active' : ''}`}
                                                    onClick={() => setCurrentPage(pageNum)}
                                                >
                                                    {pageNum}
                                                </button>
                                            );
                                        } else if (
                                            pageNum === currentPage - 2 ||
                                            pageNum === currentPage + 2
                                        ) {
                                            return <span key={pageNum} className="pagination-ellipsis">...</span>;
                                        }
                                        return null;
                                    })}

                                    <button
                                        className="pagination-btn"
                                        disabled={currentPage === totalPages}
                                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                    >
                                        &raquo;
                                    </button>
                                </div>
                            )}
                        </>
                    )
                    }
                </main>
            </div>

            {/* Login Suggestion Modal */}
            {
                showLoginPrompt && (
                    <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
                        <div className="login-prompt-modal" onClick={e => e.stopPropagation()}>
                            <div className="login-prompt-icon">
                                <Heart size={48} color="#ff4d4f" fill="#ff4d4f" />
                            </div>
                            <h3>¡Guarda tus favoritos!</h3>
                            <p>Inicia sesión o regístrate para que tus autos favoritos se guarden en tu panel y puedas verlos cuando quieras.</p>
                            <div className="login-prompt-actions">
                                <button className="btn-secondary" onClick={() => setShowLoginPrompt(false)}>Después</button>
                                <button className="btn-primary" onClick={() => navigate('/login')}>Ingresar ahora</button>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};

export default Catalog;
