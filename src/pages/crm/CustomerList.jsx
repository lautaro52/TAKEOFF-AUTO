import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Download,
    Search,
    Edit,
    Trash2,
    Eye,
    MessageCircle,
    Filter
} from 'lucide-react';
import {
    getCustomers,
    deleteCustomer,
    searchCustomers
} from '../../services/crmService';
import './CustomerList.css';

const CustomerList = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    // Filters
    const [searchTerm, setSearchTerm] = useState('');
    const [sourceFilter, setSourceFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(20);

    // Sorting
    const [sortColumn, setSortColumn] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');

    useEffect(() => {
        loadCustomers();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [customers, searchTerm, sourceFilter, typeFilter, statusFilter, dateFrom, dateTo, sortColumn, sortDirection]);

    const loadCustomers = async () => {
        try {
            setLoading(true);
            const response = await getCustomers();
            setCustomers(response.data);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...customers];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(customer =>
                customer.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.phone?.includes(searchTerm) ||
                customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                customer.whatsapp?.includes(searchTerm)
            );
        }

        // Source filter
        if (sourceFilter !== 'all') {
            filtered = filtered.filter(customer => customer.source === sourceFilter);
        }

        // Type filter
        if (typeFilter !== 'all') {
            filtered = filtered.filter(customer => customer.customer_type === typeFilter);
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(customer => customer.status === statusFilter);
        }

        // Date range filter
        if (dateFrom) {
            filtered = filtered.filter(customer =>
                new Date(customer.created_at) >= new Date(dateFrom)
            );
        }
        if (dateTo) {
            filtered = filtered.filter(customer =>
                new Date(customer.created_at) <= new Date(dateTo)
            );
        }

        // Sorting
        filtered.sort((a, b) => {
            let aVal = a[sortColumn];
            let bVal = b[sortColumn];

            if (sortColumn === 'created_at') {
                aVal = new Date(aVal);
                bVal = new Date(bVal);
            }

            if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredCustomers(filtered);
        setCurrentPage(1); // Reset to first page when filters change
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const handleDelete = async (id, name) => {
        if (window.confirm(`¿Estás seguro de eliminar al cliente "${name}"?`)) {
            try {
                await deleteCustomer(id);
                loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Error al eliminar el cliente');
            }
        }
    };

    const handleExportCSV = () => {
        const headers = ['Nombre', 'Teléfono', 'Email', 'Fuente', 'Tipo', 'Estado', 'Fecha Creación'];
        const csvData = filteredCustomers.map(customer => [
            customer.full_name,
            customer.phone || customer.whatsapp || '',
            customer.email || '',
            customer.source,
            customer.customer_type,
            customer.status,
            new Date(customer.created_at).toLocaleDateString('es-AR')
        ]);

        const csvContent = [
            headers.join(','),
            ...csvData.map(row => row.join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `clientes_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
    };

    const getSourceBadge = (source) => {
        const colors = {
            website: '#4285F4',
            partner: '#EA4335',
            direct: '#9AA0A6',
            referral: '#FBBC04',
            marketing: '#34A853'
        };
        return (
            <span
                className="source-badge"
                style={{ backgroundColor: colors[source] || '#9AA0A6' }}
            >
                {source}
            </span>
        );
    };

    const getStatusBadge = (status) => {
        const colors = {
            lead: '#fef3c7',
            prospect: '#dbeafe',
            customer: '#dcfce7',
            inactive: '#f3f4f6'
        };
        const textColors = {
            lead: '#92400e',
            prospect: '#1e40af',
            customer: '#166534',
            inactive: '#6b7280'
        };
        return (
            <span
                className="status-badge"
                style={{
                    backgroundColor: colors[status] || colors.lead,
                    color: textColors[status] || textColors.lead
                }}
            >
                {status}
            </span>
        );
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    // Pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCustomers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);

    if (loading) {
        return (
            <div className="customer-list-loading">
                <div className="spinner"></div>
                <p>Cargando clientes...</p>
            </div>
        );
    }

    return (
        <div className="customer-list">
            {/* Header */}
            <div className="list-header">
                <div className="header-left">
                    <h1>Clientes</h1>
                    <span className="count-badge">{filteredCustomers.length}</span>
                </div>
                <div className="header-actions">
                    <button className="btn-secondary" onClick={handleExportCSV}>
                        <Download size={18} />
                        Exportar CSV
                    </button>
                    <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
                        <Plus size={18} />
                        Nuevo Cliente
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre, teléfono o email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
                    <option value="all">Todas las fuentes</option>
                    <option value="website">Website</option>
                    <option value="partner">Partner</option>
                    <option value="direct">Direct</option>
                    <option value="referral">Referral</option>
                    <option value="marketing">Marketing</option>
                </select>

                <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">Todos los tipos</option>
                    <option value="buyer">Comprador</option>
                    <option value="seller">Vendedor</option>
                    <option value="both">Ambos</option>
                </select>

                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">Todos los estados</option>
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                    <option value="inactive">Inactive</option>
                </select>

                <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    placeholder="Desde"
                />

                <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    placeholder="Hasta"
                />
            </div>

            {/* Table */}
            <div className="table-container">
                <table className="customers-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('full_name')}>
                                Nombre {sortColumn === 'full_name' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Teléfono</th>
                            <th onClick={() => handleSort('email')}>
                                Email {sortColumn === 'email' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('source')}>
                                Fuente {sortColumn === 'source' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('customer_type')}>
                                Tipo {sortColumn === 'customer_type' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('status')}>
                                Estado {sortColumn === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th onClick={() => handleSort('created_at')}>
                                Fecha {sortColumn === 'created_at' && (sortDirection === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((customer) => (
                            <tr
                                key={customer.id}
                                onClick={() => navigate(`/crm/customers/${customer.id}`)}
                                className="clickable-row"
                            >
                                <td>
                                    <div className="customer-name-cell">
                                        <div className="avatar">
                                            {getInitials(customer.full_name)}
                                        </div>
                                        <span>{customer.full_name}</span>
                                    </div>
                                </td>
                                <td>
                                    {customer.whatsapp && (
                                        <a
                                            href={`https://wa.me/${customer.whatsapp.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={(e) => e.stopPropagation()}
                                            className="whatsapp-link"
                                        >
                                            <MessageCircle size={14} />
                                            {customer.whatsapp}
                                        </a>
                                    )}
                                    {!customer.whatsapp && customer.phone && customer.phone}
                                    {!customer.whatsapp && !customer.phone && '-'}
                                </td>
                                <td>{customer.email || '-'}</td>
                                <td>{getSourceBadge(customer.source)}</td>
                                <td className="capitalize">{customer.customer_type}</td>
                                <td>{getStatusBadge(customer.status)}</td>
                                <td>{new Date(customer.created_at).toLocaleDateString('es-AR')}</td>
                                <td>
                                    <div className="action-buttons" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            className="btn-icon"
                                            onClick={() => navigate(`/crm/customers/${customer.id}`)}
                                            title="Ver detalle"
                                        >
                                            <Eye size={16} />
                                        </button>
                                        <button
                                            className="btn-icon"
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setIsModalOpen(true);
                                            }}
                                            title="Editar"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            className="btn-icon btn-danger"
                                            onClick={() => handleDelete(customer.id, customer.full_name)}
                                            title="Eliminar"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {currentItems.length === 0 && (
                    <div className="empty-state">
                        <p>No se encontraron clientes</p>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Anterior
                    </button>
                    <span>
                        Página {currentPage} de {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Siguiente
                    </button>
                </div>
            )}
        </div>
    );
};

export default CustomerList;
