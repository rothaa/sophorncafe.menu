import React from 'react';
import { Drink } from '../types';
import { useStore } from '../context/StoreContext';
import { motion } from 'framer-motion';
import './DrinkCard.css';

interface DrinkCardProps {
    drink: Drink;
}

const DrinkCard: React.FC<DrinkCardProps> = ({ drink }) => {
    const { language } = useStore();

    return (
        <motion.div
            className={`card drink-card ${drink.isOutOfStock ? 'out-of-stock' : ''}`}
            whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(62, 39, 35, 0.15)' }}
            transition={{ duration: 0.2 }}
        >
            <div className="drink-img-container">
                <img src={drink.image} alt={drink.nameEn} className="drink-img" loading="lazy" />
                {drink.isBestSeller && !drink.isOutOfStock && (
                    <div className="badge best-seller-badge">
                        {language === 'en' ? 'Best Seller' : 'លក់ដាច់បំផុត'}
                    </div>
                )}
                {drink.isOutOfStock && (
                    <div className="out-of-stock-overlay">
                        <span className="out-of-stock-label">{language === 'en' ? 'Out of Stock' : 'អស់ពីស្តុក'}</span>
                    </div>
                )}
            </div>

            <div className="drink-info">
                <h3 className="drink-name">{language === 'en' ? drink.nameEn : drink.nameKh}</h3>
                <p className="drink-price">{drink.price.toLocaleString('km-KH')} ៛</p>
            </div>
        </motion.div>
    );
};

export default DrinkCard;
