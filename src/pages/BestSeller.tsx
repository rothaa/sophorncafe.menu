import React from 'react';
import { useStore } from '../context/StoreContext';
import DrinkCard from '../components/DrinkCard';
import { motion } from 'framer-motion';

const BestSeller: React.FC = () => {
    const { drinks, language, loading } = useStore();
    const bestSellers = drinks.filter(d => d.isBestSeller && !d.isHidden);

    if (loading) return <div className="container section-padding text-center">Loading Best Sellers...</div>;

    return (
        <div className="container section-padding menu-page">
            <div className="menu-header">
                <h1 className="page-title">{language === 'en' ? 'Best Sellers' : 'លក់ដាច់បំផុត'}</h1>
            </div>

            <motion.div
                className="grid menu-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {bestSellers.map(drink => (
                    <DrinkCard key={drink.id} drink={drink} />
                ))}
            </motion.div>

            {bestSellers.length === 0 && (
                <div className="empty-state">
                    {language === 'en' ? 'No best sellers available.' : 'មិនមានទេ។'}
                </div>
            )}
        </div>
    );
};

export default BestSeller;
