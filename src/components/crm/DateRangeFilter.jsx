import React, { useState } from 'react';
import './CRMModals.css';

const DateRangeFilter = ({ onChange, defaultRange }) => {
    const [selectedPreset, setSelectedPreset] = useState('custom');
    const [customFrom, setCustomFrom] = useState('');
    const [customTo, setCustomTo] = useState('');

    const getPresetDates = (preset) => {
        const today = new Date();
        const from = new Date();
        let to = new Date();

        switch (preset) {
            case 'today':
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'week':
                from.setDate(today.getDate() - today.getDay());
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'month':
                from.setDate(1);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'last30':
                from.setDate(today.getDate() - 30);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            case 'last90':
                from.setDate(today.getDate() - 90);
                from.setHours(0, 0, 0, 0);
                to.setHours(23, 59, 59, 999);
                break;
            default:
                return null;
        }

        return {
            from: from.toISOString().split('T')[0],
            to: to.toISOString().split('T')[0]
        };
    };

    const handlePresetClick = (preset) => {
        setSelectedPreset(preset);

        if (preset === 'custom') {
            return;
        }

        const dates = getPresetDates(preset);
        if (dates && onChange) {
            onChange(dates);
        }
    };

    const handleCustomChange = () => {
        if (customFrom && customTo && onChange) {
            onChange({
                from: customFrom,
                to: customTo
            });
        }
    };

    return (
        <div className="date-range-filter">
            <div className="preset-buttons">
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'today' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('today')}
                >
                    Hoy
                </button>
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'week' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('week')}
                >
                    Esta Semana
                </button>
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'month' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('month')}
                >
                    Este Mes
                </button>
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'last30' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('last30')}
                >
                    Últimos 30 días
                </button>
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'last90' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('last90')}
                >
                    Últimos 90 días
                </button>
                <button
                    type="button"
                    className={`preset-btn ${selectedPreset === 'custom' ? 'active' : ''}`}
                    onClick={() => handlePresetClick('custom')}
                >
                    Custom
                </button>
            </div>

            {selectedPreset === 'custom' && (
                <div className="custom-range">
                    <input
                        type="date"
                        value={customFrom}
                        onChange={(e) => {
                            setCustomFrom(e.target.value);
                            if (e.target.value && customTo) {
                                handleCustomChange();
                            }
                        }}
                        placeholder="Desde"
                    />
                    <span>-</span>
                    <input
                        type="date"
                        value={customTo}
                        onChange={(e) => {
                            setCustomTo(e.target.value);
                            if (customFrom && e.target.value) {
                                handleCustomChange();
                            }
                        }}
                        placeholder="Hasta"
                    />
                </div>
            )}
        </div>
    );
};

export default DateRangeFilter;
