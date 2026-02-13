import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import PurchaseProcess from '../components/PurchaseProcess'
import SimulationSection from '../components/SimulationSection'
import TrustSection from '../components/TrustSection'
import ProductGrid from '../components/ProductGrid'
import HowItWorks from '../components/HowItWorks'
import TipsSection from '../components/TipsSection'
import Testimonials from '../components/Testimonials'
import BrandGrid from '../components/BrandGrid'
import FinancingModal from '../components/FinancingModal'
import { getCars } from '../services/carsService'
import { API_CONFIG, USD_QUOTATION } from '../config';

const getNormalizedPrice = (price) => {
    const num = Number(price);
    if (isNaN(num)) return 0;
    return num < 100000 ? num * USD_QUOTATION : num;
};

const Home = () => {
    const [bestSellers, setBestSellers] = useState([]);
    const [featuredCars, setFeaturedCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [minArsPrice, setMinArsPrice] = useState(0);
    const [showFinancingModal, setShowFinancingModal] = useState(false);
    const [simulationData, setSimulationData] = useState(null);

    useEffect(() => {
        loadCars();
    }, []);

    const loadCars = async () => {
        try {
            setLoading(true);

            const allCars = await getCars();
            const availableCars = allCars.filter(car => car.status === 'disponible');

            const arsCars = availableCars.map(car => ({ ...car, normalizedPrice: getNormalizedPrice(car.price) }));
            const calculatedMinArsPrice = arsCars.length > 0
                ? Math.min(...arsCars.map(car => car.normalizedPrice))
                : 0;
            setMinArsPrice(calculatedMinArsPrice);

            const formatCar = (car) => ({
                id: car.id,
                image: car.images?.[0]?.startsWith('http')
                    ? car.images[0]
                    : `${API_CONFIG.IMAGE_BASE_URL}${car.images?.[0]}`,
                title: `${car.brand} ${car.model} ${car.year}`,
                price: Number(car.price) >= 100000
                    ? `$ ${Number(car.price).toLocaleString('es-AR')}`
                    : `$ ${Number(car.price).toLocaleString('es-AR')} USD`,
                monthly: `$ ${Math.round(Number(car.price) / 60).toLocaleString('es-AR')}${Number(car.price) < 100000 ? ' USD' : ''}`
            });

            let sellers = availableCars.filter(car => car.home_section === 'vendidos');
            if (sellers.length === 0) sellers = availableCars.slice(0, 4);
            else sellers = sellers.slice(0, 4);
            setBestSellers(sellers.map(formatCar));

            let featured = availableCars.filter(car => car.home_section === 'destacados');
            if (featured.length === 0) featured = availableCars.filter(car => car.featured).slice(0, 4);
            else featured = featured.slice(0, 4);
            setFeaturedCars(featured.map(formatCar));

            setLoading(false);
        } catch (error) {
            console.error('Error loading cars for home:', error);
            setLoading(false);
        }
    };

    const handleSimulate = (data) => {
        setSimulationData(data);
        setShowFinancingModal(true);
    };

    return (
        <div className="home">
            <Hero />
            <PurchaseProcess />
            <SimulationSection
                minArsPrice={minArsPrice}
                onCalculate={handleSimulate}
            />
            <TrustSection />

            {loading ? (
                <div style={{ padding: '60px 0', textAlign: 'center' }}>
                    <p>Cargando autos...</p>
                </div>
            ) : (
                <>
                    {bestSellers.length > 0 && (
                        <ProductGrid
                            id="best-sellers"
                            title="Los más vendidos"
                            products={bestSellers}
                        />
                    )}

                    {featuredCars.length > 0 && (
                        <ProductGrid
                            id="featured-cars"
                            title="Destacados del catálogo"
                            products={featuredCars}
                        />
                    )}

                    <TipsSection />
                    <HowItWorks />
                </>
            )}

            <Testimonials />
            <BrandGrid />

            {showFinancingModal && simulationData && (
                <FinancingModal
                    isOpen={showFinancingModal}
                    onClose={() => setShowFinancingModal(false)}
                    car={{
                        brand: 'Simulación',
                        model: 'Personalizada',
                        year: new Date().getFullYear(),
                        price: simulationData.carPrice
                    }}
                    initialDownPayment={simulationData.downPayment}
                />
            )}
        </div>
    )
}

export default Home
