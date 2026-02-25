import React, { useState, useEffect } from 'react'
import Hero from '../components/Hero'
import PurchaseProcess from '../components/PurchaseProcess'
import SimulationSection from '../components/SimulationSection'
import TrustSection from '../components/TrustSection'
import ProductGrid from '../components/ProductGrid'
import HowItWorks from '../components/HowItWorks'
import PromiseFilmstrip from '../components/PromiseFilmstrip'
import Testimonials from '../components/Testimonials'
import BrandGrid from '../components/BrandGrid'
import FinancingModal from '../components/FinancingModal'
import { getCars } from '../services/carsService'
import { API_CONFIG, USD_QUOTATION } from '../config';

// Local getNormalizedPrice removed, using arsPrice from carsService.js

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
            const availableCars = allCars.filter(car =>
                car.status === 'disponible' &&
                car.images && car.images.length > 0
            );

            const calculatedMinArsPrice = availableCars.length > 0
                ? Math.min(...availableCars.map(car => car.arsPrice).filter(p => p > 0))
                : 0;
            setMinArsPrice(calculatedMinArsPrice);

            // Mix logic for "Most Economical"
            // We want a mix of types (sedan, hatchback/hatch, etc) if available
            const sortedByPrice = availableCars
                .filter(car => car.arsPrice >= 1000000)
                .sort((a, b) => a.arsPrice - b.arsPrice);

            let sellers = [];
            const typesNeeded = ['hatchback', 'sedan', 'suv'];
            const usedIds = new Set();

            // Try to pick one of each type first
            typesNeeded.forEach(type => {
                const found = sortedByPrice.find(c => c.type?.toLowerCase().includes(type) && !usedIds.has(c.id));
                if (found) {
                    sellers.push(found);
                    usedIds.add(found.id);
                }
            });

            // Fill the rest with cheapest available
            for (const car of sortedByPrice) {
                if (sellers.length >= 4) break;
                if (!usedIds.has(car.id)) {
                    sellers.push(car);
                    usedIds.add(car.id);
                }
            }

            // Final sort by price for the selected mix
            setBestSellers(sellers.sort((a, b) => a.arsPrice - b.arsPrice));

            let featured = availableCars.filter(car => car.home_section === 'destacados');
            if (featured.length === 0) featured = availableCars.filter(car => car.featured).slice(0, 4);
            else featured = featured.slice(0, 4);
            setFeaturedCars(featured);

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
                            title="Los más económicos"
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

                    <PromiseFilmstrip />

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
