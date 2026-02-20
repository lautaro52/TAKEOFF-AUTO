import React from 'react';
import ProductCard from './ProductCard';
import './ProductGrid.css';

const ProductGrid = ({ title, products, id }) => {
    if (!products || products.length === 0) return null;

    return (
        <section className={`product-section ${id || ''}`} id={id}>
            <div className="container">
                <h2 className="section-title">{title}</h2>
                <div className="product-grid-window">
                    <div className="product-grid">
                        {products.map((product, index) => (
                            <ProductCard key={`${product.id}-${index}`} car={product} />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProductGrid;
