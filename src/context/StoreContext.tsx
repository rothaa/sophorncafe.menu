import React, { createContext, useContext, useState, useEffect } from 'react';
import { Drink, Category, CafeInfo, Language } from '../types';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';

interface StoreContextProps {
    drinks: Drink[];
    cafeInfo: CafeInfo;
    language: Language;
    loading: boolean;
    user: User | null;
    setLanguage: (lang: Language) => void;
    updateCafeInfo: (info: Partial<CafeInfo>) => Promise<void>;
    addDrink: (drink: Omit<Drink, 'id'>) => Promise<void>;
    updateDrink: (id: string, updates: Partial<Drink>) => Promise<void>;
    deleteDrink: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
    logout: () => Promise<void>;
}

const defaultCafeInfo: CafeInfo = {
    name: 'So Phorn Cafe',
    logo: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=200&auto=format&fit=crop',
    url: window.location.origin,
    locationEn: '123 Coffee Street, Phnom Penh',
    locationKh: 'ផ្លូវកាហ្វេ ១២៣ ភ្នំពេញ',
    phone: '+855 12 345 678',
    email: 'hello@sophorncafe.com',
    hoursEn: 'Mon - Sun: 7:00 AM - 8:00 PM',
    hoursKh: 'ចន្ទ - អាទិត្យ: 7:00 ព្រឹក - 8:00 យប់'
};

const StoreContext = createContext<StoreContextProps | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [cafeInfo, setCafeInfo] = useState<CafeInfo>(defaultCafeInfo);
    const [language, setLanguage] = useState<Language>('en');
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Drinks
            const { data: drinksData, error: drinksError } = await supabase
                .from('drinks')
                .select('*')
                .order('created_at', { ascending: false });

            if (drinksError) throw drinksError;

            const mappedDrinks = (drinksData || []).map(d => ({
                id: d.id,
                nameEn: d.name_en,
                nameKh: d.name_kh,
                price: Number(d.price),
                category: d.category as Category,
                image: d.image,
                isBestSeller: d.is_best_seller,
                isOutOfStock: d.is_out_of_stock,
                isHidden: d.is_hidden
            }));
            setDrinks(mappedDrinks);

            // Fetch Cafe Info
            const { data: infoData, error: infoError } = await supabase
                .from('cafe_info')
                .select('*')
                .single();

            if (infoError && infoError.code !== 'PGRST116') throw infoError;
            if (infoData) {
                setCafeInfo({
                    name: infoData.name,
                    logo: infoData.logo,
                    url: infoData.url,
                    locationEn: infoData.location_en,
                    locationKh: infoData.location_kh,
                    phone: infoData.phone,
                    email: infoData.email,
                    hoursEn: infoData.hours_en,
                    hoursKh: infoData.hours_kh
                });
            }
        } catch (err) {
            console.error('Error fetching data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();

        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const updateCafeInfo = async (info: Partial<CafeInfo>) => {
        try {
            // Map camelCase to snake_case for Supabase
            const dbInfo: any = {};
            if (info.name !== undefined) dbInfo.name = info.name;
            if (info.logo !== undefined) dbInfo.logo = info.logo;
            if (info.url !== undefined) dbInfo.url = info.url;
            if (info.locationEn !== undefined) dbInfo.location_en = info.locationEn;
            if (info.locationKh !== undefined) dbInfo.location_kh = info.locationKh;
            if (info.phone !== undefined) dbInfo.phone = info.phone;
            if (info.email !== undefined) dbInfo.email = info.email;
            if (info.hoursEn !== undefined) dbInfo.hours_en = info.hoursEn;
            if (info.hoursKh !== undefined) dbInfo.hours_kh = info.hoursKh;

            const { error } = await supabase
                .from('cafe_info')
                .update(dbInfo)
                .eq('id', 1);
            if (error) throw error;
            setCafeInfo(prev => ({ ...prev, ...info }));
        } catch (err) {
            console.error('Error updating cafe info:', err);
            alert('Failed to update settings');
        }
    };

    const addDrink = async (drink: Omit<Drink, 'id'>) => {
        try {
            const dbDrink = {
                name_en: drink.nameEn,
                name_kh: drink.nameKh,
                price: drink.price,
                category: drink.category,
                image: drink.image,
                is_best_seller: drink.isBestSeller,
                is_out_of_stock: drink.isOutOfStock,
                is_hidden: drink.isHidden
            };

            const { data, error } = await supabase
                .from('drinks')
                .insert([dbDrink])
                .select()
                .single();

            if (error) throw error;

            const newDrink = {
                id: data.id,
                nameEn: data.name_en,
                nameKh: data.name_kh,
                price: Number(data.price),
                category: data.category as Category,
                image: data.image,
                isBestSeller: data.is_best_seller,
                isOutOfStock: data.is_out_of_stock,
                isHidden: data.is_hidden
            };

            setDrinks(prev => [newDrink, ...prev]);
        } catch (err) {
            console.error('Error adding drink:', err);
            alert('Failed to add drink');
        }
    };

    const updateDrink = async (id: string, updates: Partial<Drink>) => {
        try {
            const dbUpdates: any = {};
            if (updates.nameEn !== undefined) dbUpdates.name_en = updates.nameEn;
            if (updates.nameKh !== undefined) dbUpdates.name_kh = updates.nameKh;
            if (updates.price !== undefined) dbUpdates.price = updates.price;
            if (updates.category !== undefined) dbUpdates.category = updates.category;
            if (updates.image !== undefined) dbUpdates.image = updates.image;
            if (updates.isBestSeller !== undefined) dbUpdates.is_best_seller = updates.isBestSeller;
            if (updates.isOutOfStock !== undefined) dbUpdates.is_out_of_stock = updates.isOutOfStock;
            if (updates.isHidden !== undefined) dbUpdates.is_hidden = updates.isHidden;

            const { error } = await supabase
                .from('drinks')
                .update(dbUpdates)
                .eq('id', id);

            if (error) throw error;

            setDrinks(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
        } catch (err) {
            console.error('Error updating drink:', err);
            alert('Failed to update drink');
        }
    };

    const deleteDrink = async (id: string) => {
        try {
            const { error } = await supabase
                .from('drinks')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setDrinks(prev => prev.filter(d => d.id !== id));
        } catch (err) {
            console.error('Error deleting drink:', err);
            alert('Failed to delete drink');
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    return (
        <StoreContext.Provider value={{
            drinks, cafeInfo, language, loading, user,
            setLanguage, updateCafeInfo, addDrink, updateDrink, deleteDrink,
            refreshData: fetchData,
            logout
        }}>
            {children}
        </StoreContext.Provider>
    );
};

export const useStore = () => {
    const context = useContext(StoreContext);
    if (!context) throw new Error('useStore must be used within a StoreProvider');
    return context;
};
