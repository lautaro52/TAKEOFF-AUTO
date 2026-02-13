import React, { useState, useEffect } from 'react';
import './ServiceBanners.css';
import banner1 from '../assets/banner-1.png';
import banner2 from '../assets/banner-2.png';
import banner3 from '../assets/banner-3.png';

const ServiceBanners = () => {
    const banners = [
        { image: banner1, link: "#credito", alt: "Crédito TAKEOFF" },
        { image: banner2, link: "#prestamo", alt: "Préstamo TAKEOFF" },
        { image: banner3, link: "#cambia", alt: "Cambia tu auto" }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    // Detect if we're on mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 992);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-advance carousel on mobile every 4 seconds
    useEffect(() => {
        if (!isMobile) return;

        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
        }, 4000);

        return () => clearInterval(interval);
    }, [isMobile, banners.length]);

    const goToSlide = (index) => {
        setCurrentIndex(index);
    };

    return (
        <section className="service-banners">
            <div className="container">
                {isMobile ? (
                    // Mobile: Carousel view
                    <div className="banners-carousel">
                        <div className="carousel-wrapper">
                            <div
                                className="carousel-track"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {banners.map((banner, index) => (
                                    <a key={index} href={banner.link} className="banner-carousel-item">
                                        <img src={banner.image} alt={banner.alt} className="banner-full-img" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Carousel indicators */}
                        <div className="carousel-indicators">
                            {banners.map((_, index) => (
                                <button
                                    key={index}
                                    className={`indicator-dot ${index === currentIndex ? 'active' : ''}`}
                                    onClick={() => goToSlide(index)}
                                    aria-label={`Go to slide ${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    // Desktop: Grid view (unchanged)
                    <div className="banners-grid-refined">
                        {banners.map((banner, index) => (
                            <a key={index} href={banner.link} className="banner-card-image-only">
                                <img src={banner.image} alt={banner.alt} className="banner-full-img" />
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceBanners;
