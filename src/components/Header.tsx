import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Menu, X, Coffee, LogOut } from 'lucide-react';
import './Header.css';

const Header: React.FC = () => {
    const { cafeInfo, language, setLanguage, user, logout } = useStore();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const isAdminPage = location.pathname.startsWith('/admin');

    const toggleLang = () => {
        setLanguage(language === 'en' ? 'kh' : 'en');
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    const handleLogout = async () => {
        await logout();
        closeMenu();
        navigate('/');
    };

    return (
        <header className="header">
            <div className="container header-container">
                <div className="header-left">
                    <NavLink to="/" className="logo-section" onClick={closeMenu}>
                        {cafeInfo.logo ? (
                            <img src={cafeInfo.logo} alt="Logo" className="logo-img" />
                        ) : (
                            <Coffee className="logo-icon" size={32} />
                        )}
                        <span className="shop-name">{cafeInfo.name}</span>
                    </NavLink>
                </div>

                {!isAdminPage && (
                    <nav className={`desktop-nav ${isMobileMenuOpen ? 'open' : ''}`}>
                        <NavLink to="/" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            {language === 'en' ? 'Home' : 'ទំព័រដើម'}
                        </NavLink>
                        <NavLink to="/menu" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            {language === 'en' ? 'Menu' : 'ម៉ឺនុយ'}
                        </NavLink>
                        <NavLink to="/best-seller" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            {language === 'en' ? 'Best Seller' : 'លក់ដាច់បំផុត'}
                        </NavLink>
                        <NavLink to="/contact" onClick={closeMenu} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                            {language === 'en' ? 'Contact' : 'ទំនាក់ទំនង'}
                        </NavLink>
                    </nav>
                )}

                {isAdminPage && (
                    <nav className="desktop-nav">
                        <span className="admin-status-label">
                            {language === 'en' ? 'Seller Dashboard' : 'ផ្ទាំងគ្រប់គ្រងអ្នកលក់'}
                        </span>
                    </nav>
                )}

                <div className="header-actions">
                    <button className="lang-toggle" onClick={toggleLang}>
                        {language === 'en' ? 'KH' : 'EN'}
                    </button>

                    {user && (
                        <button className="icon-btn logout-btn" onClick={handleLogout} title="Logout">
                            <LogOut size={20} />
                        </button>
                    )}

                    <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;
