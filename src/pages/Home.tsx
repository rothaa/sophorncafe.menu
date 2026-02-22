import React from 'react';
import { useStore } from '../context/StoreContext';
import { NavLink } from 'react-router-dom';
import DrinkCard from '../components/DrinkCard';
import { ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import './Home.css';

const Home: React.FC = () => {
    const { drinks, language, cafeInfo, loading } = useStore();

    const bestSellers = drinks.filter(d => d.isBestSeller && !d.isHidden).slice(0, 4);

    if (loading) return <div className="container section-padding text-center">Loading Cafe...</div>;

    return (
        <div className="home">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-overlay"></div>
                <div className="container hero-content">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="hero-title"
                    >
                        {language === 'en' ? `Welcome to ${cafeInfo.name}` : `សូមស្វាគមន៍មកកាន់ ${cafeInfo.name}`}
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="hero-subtitle"
                    >
                        {language === 'en'
                            ? 'Minimalist vibes, maximum flavor. Your daily dose of perfection.'
                            : 'បរិយាកាសស្ងប់ស្ងាត់ រសជាតិដ៏អស្ចារ្យ។'}
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <NavLink to="/menu" className="btn btn-primary">
                            {language === 'en' ? 'Explore Menu' : 'មើលម៉ឺនុយ'} <ChevronRight size={20} />
                        </NavLink>
                    </motion.div>
                </div>
            </section>

            {/* Highlights / Best Sellers Summary */}
            <section className="container section-padding">
                <div className="section-header">
                    <h2 className="section-title">
                        {language === 'en' ? 'Our Best Sellers' : 'ភេសជ្ជៈលក់ដាច់បំផុត'}
                    </h2>
                    <NavLink to="/best-seller" className="view-all-link">
                        {language === 'en' ? 'View All' : 'មើលទាំងអស់'} <ChevronRight size={16} />
                    </NavLink>
                </div>

                <div className="grid best-seller-grid">
                    {bestSellers.map(drink => (
                        <DrinkCard key={drink.id} drink={drink} />
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
