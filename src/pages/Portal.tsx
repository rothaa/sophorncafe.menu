import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Briefcase, ChevronRight, User, Languages } from 'lucide-react';
import { motion } from 'framer-motion';
import { useStore } from '../context/StoreContext';
import './Portal.css';

const Portal: React.FC = () => {
    const navigate = useNavigate();
    const { cafeInfo, language, setLanguage } = useStore();

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'kh' : 'en');
    };

    return (
        <div className="portal-page">
            <button className="portal-lang-btn" onClick={toggleLang}>
                <Languages size={20} />
                <span>{language === 'en' ? 'ខ្មែរ' : 'English'}</span>
            </button>

            <div className="portal-container">
                <motion.div
                    className="portal-brand"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="portal-logo">
                        {cafeInfo.logo ? (
                            <img src={cafeInfo.logo} alt="Logo" />
                        ) : (
                            <Coffee size={40} />
                        )}
                    </div>
                    <h1>{cafeInfo.name}</h1>
                    <p>{language === 'en' ? 'Digital Experience' : 'បទពិសោធន៍ឌីជីថល'}</p>
                </motion.div>

                <div className="portal-choices">
                    <motion.button
                        className="portal-card customer"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        onClick={() => navigate('/home')}
                    >
                        <div className="card-icon">
                            <User size={32} />
                        </div>
                        <div className="card-content">
                            <h3>{language === 'en' ? 'Customer' : 'អតិថិជន'}</h3>
                            <p>{language === 'en' ? 'View menu & order' : 'មើលម៉ឺនុយ និងកម្ម៉ង់'}</p>
                        </div>
                        <ChevronRight className="arrow" />
                    </motion.button>

                    <motion.button
                        className="portal-card seller"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        onClick={() => navigate('/admin')}
                    >
                        <div className="card-icon">
                            <Briefcase size={32} />
                        </div>
                        <div className="card-content">
                            <h3>{language === 'en' ? 'Seller' : 'អ្នកលក់'}</h3>
                            <p>{language === 'en' ? 'Manage drinks & shop' : 'គ្រប់គ្រងហាង និងភេសជ្ជៈ'}</p>
                        </div>
                        <ChevronRight className="arrow" />
                    </motion.button>
                </div>

                <motion.div
                    className="portal-footer"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <p>© {new Date().getFullYear()} {cafeInfo.name}. All rights reserved.</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Portal;
