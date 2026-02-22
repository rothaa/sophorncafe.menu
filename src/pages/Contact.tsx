import React from 'react';
import { useStore } from '../context/StoreContext';
import { MapPin, Phone, Clock, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact: React.FC = () => {
    const { language, cafeInfo } = useStore();

    return (
        <div className="container section-padding contact-page">
            <h1 className="page-title text-center mb-4">{language === 'en' ? 'Get in Touch' : 'ទំនាក់ទំនងពួកយើង'}</h1>

            <div className="contact-grid">
                <motion.div
                    className="contact-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="contact-icon-wrapper">
                        <MapPin size={32} className="contact-icon" />
                    </div>
                    <h3>{language === 'en' ? 'Location' : 'ទីតាំង'}</h3>
                    <p>{language === 'en' ? (cafeInfo.locationEn || '123 Coffee Street, Phnom Penh') : (cafeInfo.locationKh || 'ផ្លូវកាហ្វេ ១២៣ ភ្នំពេញ')}</p>
                </motion.div>

                <motion.div
                    className="contact-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="contact-icon-wrapper">
                        <Phone size={32} className="contact-icon" />
                    </div>
                    <h3>{language === 'en' ? 'Phone' : 'ទូរស័ព្ទ'}</h3>
                    <p>{cafeInfo.phone || '+855 12 345 678'}</p>
                </motion.div>

                <motion.div
                    className="contact-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <div className="contact-icon-wrapper">
                        <Clock size={32} className="contact-icon" />
                    </div>
                    <h3>{language === 'en' ? 'Hours' : 'ម៉ោងធ្វើការ'}</h3>
                    <p>{language === 'en' ? (cafeInfo.hoursEn || 'Mon - Sun: 7:00 AM - 8:00 PM') : (cafeInfo.hoursKh || 'ចន្ទ - អាទិត្យ: 7:00 ព្រឹក - 8:00 យប់')}</p>
                </motion.div>

                <motion.div
                    className="contact-card card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                >
                    <div className="contact-icon-wrapper">
                        <Mail size={32} className="contact-icon" />
                    </div>
                    <h3>{language === 'en' ? 'Email' : 'អ៊ីមែល'}</h3>
                    <p>{cafeInfo.email || `hello@${cafeInfo.name.toLowerCase().replace(/\s/g, '')}.com`}</p>
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
