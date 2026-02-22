import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import DrinkCard from '../components/DrinkCard';
import { Category } from '../types';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Menu.css';

const CATEGORIES: Category[] = ['Hot', 'Ice', 'Tea', 'Frappe', 'Smoothie'];

const Menu: React.FC = () => {
    const { drinks, language, loading } = useStore();
    const [activeCategory, setActiveCategory] = useState<Category | 'All'>('All');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredDrinks = useMemo(() => {
        return drinks.filter(drink => {
            if (drink.isHidden) return false;
            const matchesSearch =
                drink.nameEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                drink.nameKh.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeCategory === 'All' || drink.category === activeCategory;
            return matchesSearch && matchesCategory;
        });
    }, [drinks, activeCategory, searchTerm]);

    if (loading) return <div className="container section-padding text-center">Loading Menu...</div>;

    return (
        <div className="container section-padding menu-page">
            <div className="menu-header">
                <h1 className="page-title">{language === 'en' ? 'Our Menu' : 'ម៉ឺនុយរបស់យើង'}</h1>

                <div className="search-bar">
                    <Search size={20} className="search-icon" />
                    <input
                        type="text"
                        className="input search-input"
                        placeholder={language === 'en' ? 'Search drinks...' : 'ស្វែងរកភេសជ្ជៈ...'}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="category-filter">
                <button
                    className={`cat-btn ${activeCategory === 'All' ? 'active' : ''}`}
                    onClick={() => setActiveCategory('All')}
                >
                    {language === 'en' ? 'All' : 'ទាំងអស់'}
                </button>
                {CATEGORIES.map(cat => (
                    <button
                        key={cat}
                        className={`cat-btn ${activeCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveCategory(cat)}
                    >
                        {/* Simple translation map for categories */}
                        {language === 'en' ? cat : (
                            cat === 'Hot' ? 'ក្តៅ' :
                                cat === 'Ice' ? 'ត្រជាក់' :
                                    cat === 'Tea' ? 'តែ' :
                                        cat === 'Frappe' ? 'ហ្វ្រាប់ប៉េ' : 'ទឹកក្រឡុក'
                        )}
                    </button>
                ))}
            </div>

            <motion.div layout className="grid menu-grid">
                <AnimatePresence>
                    {filteredDrinks.map(drink => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.3 }}
                            key={drink.id}
                        >
                            <DrinkCard drink={drink} />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>

            {filteredDrinks.length === 0 && (
                <div className="empty-state">
                    {language === 'en' ? 'No drinks found.' : 'រកមិនឃើញភេសជ្ជៈ។'}
                </div>
            )}
        </div>
    );
};

export default Menu;
