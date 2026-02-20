import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, FileText, User, LogOut, ChevronRight, Clock, Star, MapPin } from 'lucide-react';
import { userService } from '../services/userService';
import { API_CONFIG } from '../config';
import ProductCard from '../components/ProductCard';
import './UserDashboard.css';

const UserDashboard = () => {
    const [user, setUser] = useState(null);
    const [activities, setActivities] = useState({ favorites: [], quotes: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = userService.getCurrentUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        loadActivities();
    }, [navigate]);

    const loadActivities = async () => {
        try {
            setLoading(true);
            const data = await userService.getActivities();
            if (data.success) {
                // Ensure images is an array (backend returns a string separated by ||)
                const processActivities = (items) => {
                    return (items || []).map(item => {
                        if (typeof item.images === 'string') {
                            item.images = item.images.split('||').filter(img => img);
                        }
                        return item;
                    });
                };

                setActivities({
                    favorites: processActivities(data.favorites),
                    quotes: processActivities(data.quotes)
                });
            }
        } catch (error) {
            console.error('Error loading activities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        userService.logout();
        navigate('/');
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            maximumFractionDigits: 0
        }).format(price);
    };



    if (!user) return null;

    return (
        <div className="dashboard-page">
            <header className="dashboard-header">
                <div className="container">
                    <div className="user-profile-summary">
                        <div className="user-avatar">
                            {(user.full_name || user.email)[0].toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h1>Hola, {user.full_name || 'Usuario'}</h1>
                            <p className="user-email-detail">{user.email}</p>
                            <p className="user-id-details">DNI: {user.dni} • {user.whatsapp}</p>
                        </div>
                        <button className="logout-btn" onClick={handleLogout} title="Cerrar sesión">
                            <LogOut size={20} />
                            <span>Salir</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="dashboard-content">
                <div className="container">
                    {loading ? (
                        <div className="loading-state">
                            <div className="loader"></div>
                            <p>Actualizando tu panel...</p>
                        </div>
                    ) : (
                        <div className="cars-grid">
                            {activities.favorites.length > 0 ? (
                                activities.favorites.map(car => (
                                    <ProductCard key={`fav-${car.id}`} car={car} />
                                ))
                            ) : (
                                <div className="empty-state">
                                    <Heart size={48} color="#ccc" />
                                    <h3>No tienes favoritos aún</h3>
                                    <p>Explora nuestro catálogo y marca los autos que más te gusten.</p>
                                    <button className="btn-primary" onClick={() => navigate('/catalogo')}>Ir al catálogo</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserDashboard;
