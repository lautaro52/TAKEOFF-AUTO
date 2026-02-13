import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './SimulationSection.css';

const SimulationSection = ({ minArsPrice, onCalculate }) => {
    const [carValue, setCarValue] = useState('');
    const [incomeValue, setIncomeValue] = useState('');
    const [isHighlighted, setIsHighlighted] = useState(false);
    const [error, setError] = useState('');

    // Listen for custom event to trigger highlight
    React.useEffect(() => {
        const handleHighlight = () => {
            setIsHighlighted(true);
            setTimeout(() => setIsHighlighted(false), 3000); // Remove after 3s
        };
        window.addEventListener('highlight-calculator', handleHighlight);
        return () => window.removeEventListener('highlight-calculator', handleHighlight);
    }, []);

    const formatCurrencyInput = (val) => {
        if (!val) return '';
        const numeric = val.toString().replace(/\D/g, '');
        if (!numeric) return '';
        return '$ ' + Number(numeric).toLocaleString('es-AR');
    };

    const parseCurrencyInput = (val) => {
        return val.toString().replace(/\D/g, '');
    };

    const handleCalculate = () => {
        const price = Number(carValue);
        const income = Number(incomeValue);

        if (!carValue || price === 0) {
            setError('Por favor ingresa el valor del auto');
            return;
        }

        if (price < minArsPrice) {
            setError(`El precio mínimo es $ ${Number(minArsPrice).toLocaleString('es-AR')}`);
            return;
        }

        setError('');
        if (onCalculate) {
            onCalculate({
                carPrice: price,
                downPayment: income
            });
        }
    };

    return (
        <section className={`simulation-section-static ${isHighlighted ? 'active-highlight' : ''}`} id="simulation-section">
            <div className="container">
                <div className="simulation-wrapper-static">
                    <div className="simulation-left-content">
                        <h2>Paga tu próximo auto a meses</h2>
                        <p>Arma tu presupuesto en solo 1 minuto</p>
                        <Link to="/catalogo" className="btn-simular-primary">
                            Ver autos.
                        </Link>

                        <div className="financier-logos">
                            <img src="/assets/logos/santander.png" alt="Santander Rio" title="Santander Rio" />
                            <img src="/assets/logos/galicia.png" alt="Banco Galicia" title="Banco Galicia" />
                            <img src="/assets/logos/bancor.png" alt="Bancor" title="Bancor" />
                            <img src="/assets/logos/bna.png" alt="Banco Nación" title="Banco Nación" />
                            <img src="/assets/logos/fiat.png" alt="Fiat" title="Fiat" />
                            <img src="/assets/logos/jeep.png" alt="Jeep" title="Jeep" />
                        </div>
                    </div>

                    <div className="simulation-right-preview">
                        <div className="preview-card simplified">
                            <div className="preview-fields">
                                <div className="preview-field">
                                    <label>Valor del auto aproximado</label>
                                    <input
                                        type="text"
                                        className="preview-input"
                                        placeholder={`Mín. $ ${Number(minArsPrice).toLocaleString('es-AR')}`}
                                        value={formatCurrencyInput(carValue)}
                                        onChange={(e) => {
                                            setCarValue(parseCurrencyInput(e.target.value));
                                            setError('');
                                        }}
                                    />
                                </div>

                                <div className="preview-field">
                                    <label>Ingreso de capital</label>
                                    <input
                                        type="text"
                                        className="preview-input"
                                        placeholder="$ 0"
                                        value={formatCurrencyInput(incomeValue)}
                                        onChange={(e) => setIncomeValue(parseCurrencyInput(e.target.value))}
                                    />
                                </div>
                            </div>

                            {error && <p className="error-message" style={{ color: '#ff4d4f', fontSize: '0.85rem', marginBottom: '15px', fontWeight: 'bold' }}>{error}</p>}

                            <div className="preview-footer-btn">
                                <button className="btn-calcular-now" onClick={handleCalculate}>
                                    Calcular
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Decorative geometric shapes */}
                    <div className="geo-shape geo-shape-1"></div>
                    <div className="geo-shape geo-shape-2"></div>
                    <div className="geo-shape geo-shape-3"></div>
                </div>
            </div>
        </section>
    );
};

export default SimulationSection;
