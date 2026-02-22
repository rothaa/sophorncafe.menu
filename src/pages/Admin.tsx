import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../context/StoreContext';
import { Drink, Category } from '../types';
import { Edit2, Trash2, Plus, X, Upload, Link as LinkIcon, Loader, Save, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabase';
import './Admin.css';

const Admin: React.FC = () => {
    const { drinks, addDrink, updateDrink, deleteDrink, cafeInfo, updateCafeInfo, loading } = useStore();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
    const [imageMode, setImageMode] = useState<'url' | 'file'>('url');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Settings Form State
    const [settingsForm, setSettingsForm] = useState({
        name: cafeInfo.name,
        logo: cafeInfo.logo || '',
        url: cafeInfo.url,
        locationEn: cafeInfo.locationEn || '',
        locationKh: cafeInfo.locationKh || '',
        phone: cafeInfo.phone || '',
        email: cafeInfo.email || '',
        hoursEn: cafeInfo.hoursEn || '',
        hoursKh: cafeInfo.hoursKh || ''
    });

    useEffect(() => {
        setSettingsForm({
            name: cafeInfo.name,
            logo: cafeInfo.logo || '',
            url: cafeInfo.url,
            locationEn: cafeInfo.locationEn || '',
            locationKh: cafeInfo.locationKh || '',
            phone: cafeInfo.phone || '',
            email: cafeInfo.email || '',
            hoursEn: cafeInfo.hoursEn || '',
            hoursKh: cafeInfo.hoursKh || ''
        });
    }, [cafeInfo]);

    // Drink Form State
    const [form, setForm] = useState({
        nameEn: '',
        nameKh: '',
        price: '',
        category: 'Hot' as Category,
        image: '',
        isBestSeller: false,
        isOutOfStock: false,
        isHidden: false
    });

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await updateCafeInfo(settingsForm);
        alert('Settings updated!');
    };

    const openForm = (drink?: Drink) => {
        if (drink) {
            setEditingDrink(drink);
            setForm({
                nameEn: drink.nameEn,
                nameKh: drink.nameKh,
                price: drink.price.toString(),
                category: drink.category,
                image: drink.image,
                isBestSeller: drink.isBestSeller,
                isOutOfStock: drink.isOutOfStock,
                isHidden: drink.isHidden
            });
            setImageMode('url');
        } else {
            setEditingDrink(null);
            setForm({
                nameEn: '',
                nameKh: '',
                price: '',
                category: 'Hot',
                image: '',
                isBestSeller: false,
                isOutOfStock: false,
                isHidden: false
            });
            setImageMode('url');
        }
        setSelectedFile(null);
        setPreviewUrl(null);
        setIsModalOpen(true);
    };

    const closeForm = () => {
        setIsModalOpen(false);
        setEditingDrink(null);
        setSelectedFile(null);
        setPreviewUrl(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const uploadImage = async (file: File): Promise<string | null> => {
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `drinks/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('drink-images')
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data } = supabase.storage
                .from('drink-images')
                .getPublicUrl(filePath);

            return data.publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Error uploading image. Make sure the "drink-images" bucket exists and is public.');
            return null;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const priceNum = parseFloat(form.price);
        if (isNaN(priceNum)) {
            alert("Invalid price");
            return;
        }

        setIsUploading(true);
        let finalImageUrl = form.image;

        if (imageMode === 'file' && selectedFile) {
            const uploadedUrl = await uploadImage(selectedFile);
            if (uploadedUrl) {
                finalImageUrl = uploadedUrl;
            } else {
                setIsUploading(false);
                return;
            }
        }

        const defaultImage = "https://images.unsplash.com/photo-1559525839-b184a4d698c7?q=80&w=400&auto=format&fit=crop";

        try {
            if (editingDrink) {
                await updateDrink(editingDrink.id, {
                    ...form,
                    price: priceNum,
                    image: finalImageUrl || defaultImage
                });
            } else {
                await addDrink({
                    ...form,
                    price: priceNum,
                    image: finalImageUrl || defaultImage
                });
            }
            closeForm();
        } catch (error) {
            console.error('Error saving drink:', error);
        } finally {
            setIsUploading(false);
        }
    };

    if (loading) return <div className="container section-padding text-center">Loading Admin Data...</div>;

    return (
        <div className="container section-padding admin-page">
            <h1 className="page-title mb-4">Admin Dashboard</h1>

            {/* Settings Section */}
            <section className="admin-section card mb-5 p-4">
                <div className="d-flex items-center gap-2 mb-4">
                    <Info size={24} className="text-primary" />
                    <h2 className="m-0">Cafe & Contact Settings</h2>
                </div>

                <form onSubmit={handleSettingsSubmit}>
                    <div className="admin-grid mb-4">
                        <div className="form-group">
                            <label>Cafe Name</label>
                            <input className="input" value={settingsForm.name} onChange={e => setSettingsForm({ ...settingsForm, name: e.target.value })} required />
                        </div>
                        <div className="form-group">
                            <label>Logo URL</label>
                            <input className="input" value={settingsForm.logo} onChange={e => setSettingsForm({ ...settingsForm, logo: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Website URL (For QR Code)</label>
                            <input className="input" value={settingsForm.url} onChange={e => setSettingsForm({ ...settingsForm, url: e.target.value })} required />
                        </div>
                    </div>

                    <div className="admin-grid mb-4">
                        <div className="form-group">
                            <label>Phone Number</label>
                            <input className="input" value={settingsForm.phone} onChange={e => setSettingsForm({ ...settingsForm, phone: e.target.value })} placeholder="+855 12 345 678" />
                        </div>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input type="email" className="input" value={settingsForm.email} onChange={e => setSettingsForm({ ...settingsForm, email: e.target.value })} placeholder="hello@cafe.com" />
                        </div>
                    </div>

                    <div className="admin-grid mb-4">
                        <div className="form-group">
                            <label>Location (English)</label>
                            <input className="input" value={settingsForm.locationEn} onChange={e => setSettingsForm({ ...settingsForm, locationEn: e.target.value })} placeholder="123 Street, Phnom Penh" />
                        </div>
                        <div className="form-group">
                            <label>Location (Khmer)</label>
                            <input className="input" value={settingsForm.locationKh} onChange={e => setSettingsForm({ ...settingsForm, locationKh: e.target.value })} placeholder="ផ្លូវ ១២៣ ភ្នំពេញ" />
                        </div>
                    </div>

                    <div className="admin-grid mb-4">
                        <div className="form-group">
                            <label>Opening Hours (English)</label>
                            <input className="input" value={settingsForm.hoursEn} onChange={e => setSettingsForm({ ...settingsForm, hoursEn: e.target.value })} placeholder="Mon - Sun: 7am - 8pm" />
                        </div>
                        <div className="form-group">
                            <label>Opening Hours (Khmer)</label>
                            <input className="input" value={settingsForm.hoursKh} onChange={e => setSettingsForm({ ...settingsForm, hoursKh: e.target.value })} placeholder="ចន្ទ - អាទិត្យ: ៧ព្រឹក - ៨យប់" />
                        </div>
                    </div>

                    <div className="d-flex justify-end">
                        <button type="submit" className="btn btn-primary d-flex items-center gap-2">
                            <Save size={18} /> Save All Settings
                        </button>
                    </div>
                </form>
            </section>

            {/* Product Management */}
            <section className="admin-section card p-4">
                <div className="d-flex justify-between items-center mb-4">
                    <h2>Menu Management</h2>
                    <button className="btn btn-primary" onClick={() => openForm()}>
                        <Plus size={18} /> Add Drink
                    </button>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Name (EN/KH)</th>
                                <th>Category</th>
                                <th>Price</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {drinks.map(drink => (
                                <tr key={drink.id} className={drink.isHidden ? 'hidden-row' : ''}>
                                    <td>
                                        <img src={drink.image} alt="drink" className="table-img" />
                                    </td>
                                    <td>
                                        <div className="font-bold">{drink.nameEn}</div>
                                        <div className="text-sm text-gray">{drink.nameKh}</div>
                                    </td>
                                    <td>{drink.category}</td>
                                    <td>{drink.price.toLocaleString('km-KH')} ៛</td>
                                    <td>
                                        <div className="status-badges">
                                            {drink.isBestSeller && <span className="status-badge best">Best</span>}
                                            {drink.isOutOfStock && <span className="status-badge stock">Out</span>}
                                            {drink.isHidden && <span className="status-badge hidden">Hidden</span>}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="icon-btn edit-btn" onClick={() => openForm(drink)}><Edit2 size={16} /></button>
                                            <button className="icon-btn delete-btn" onClick={() => {
                                                if (confirm('Delete this drink?')) deleteDrink(drink.id);
                                            }}><Trash2 size={16} /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {drinks.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center p-4">No drinks found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <>
                        <motion.div
                            className="modal-overlay"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeForm}
                        />
                        <motion.div
                            className="modal card"
                            initial={{ opacity: 0, y: "-40%", x: "-50%", scale: 0.95 }}
                            animate={{ opacity: 1, y: "-50%", x: "-50%", scale: 1 }}
                            exit={{ opacity: 0, y: "-40%", x: "-50%", scale: 0.95 }}
                        >
                            <div className="modal-header">
                                <h3>{editingDrink ? 'Edit Drink' : 'Add New Drink'}</h3>
                                <button className="close-btn" onClick={closeForm}><X size={20} /></button>
                            </div>

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label>Name (English) *</label>
                                        <input className="input" required value={form.nameEn} onChange={e => setForm({ ...form, nameEn: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Name (Khmer) *</label>
                                        <input className="input" required value={form.nameKh} onChange={e => setForm({ ...form, nameKh: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Price (៛) *</label>
                                        <input type="number" step="100" className="input" required value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                                    </div>
                                    <div className="form-group">
                                        <label>Category *</label>
                                        <select className="select" value={form.category} onChange={e => setForm({ ...form, category: e.target.value as Category })}>
                                            <option value="Hot">Hot</option>
                                            <option value="Ice">Ice</option>
                                            <option value="Tea">Tea</option>
                                            <option value="Frappe">Frappe</option>
                                            <option value="Smoothie">Smoothie</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Drink Image</label>
                                        <div className="image-mode-tabs">
                                            <button
                                                type="button"
                                                className={`mode-tab ${imageMode === 'url' ? 'active' : ''}`}
                                                onClick={() => setImageMode('url')}
                                            >
                                                <LinkIcon size={14} /> Image URL
                                            </button>
                                            <button
                                                type="button"
                                                className={`mode-tab ${imageMode === 'file' ? 'active' : ''}`}
                                                onClick={() => setImageMode('file')}
                                            >
                                                <Upload size={14} /> Upload File
                                            </button>
                                        </div>

                                        {imageMode === 'url' ? (
                                            <input
                                                className="input"
                                                value={form.image}
                                                onChange={e => setForm({ ...form, image: e.target.value })}
                                                placeholder="https://example.com/image.jpg"
                                            />
                                        ) : (
                                            <div className="file-upload-container">
                                                <input
                                                    type="file"
                                                    ref={fileInputRef}
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    style={{ display: 'none' }}
                                                />
                                                <div
                                                    className="file-dropzone"
                                                    onClick={() => fileInputRef.current?.click()}
                                                >
                                                    {previewUrl ? (
                                                        <img src={previewUrl} alt="Preview" className="upload-preview" />
                                                    ) : (
                                                        <>
                                                            <Upload size={24} className="mb-2" />
                                                            <span>Click to select image</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="checkboxes">
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={form.isBestSeller} onChange={e => setForm({ ...form, isBestSeller: e.target.checked })} />
                                            Mark as Best Seller
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={form.isOutOfStock} onChange={e => setForm({ ...form, isOutOfStock: e.target.checked })} />
                                            Mark as Out of Stock
                                        </label>
                                        <label className="checkbox-label">
                                            <input type="checkbox" checked={form.isHidden} onChange={e => setForm({ ...form, isHidden: e.target.checked })} />
                                            Hide from public view
                                        </label>
                                    </div>

                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn" onClick={closeForm} disabled={isUploading}>Cancel</button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isUploading}
                                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                                    >
                                        {isUploading && <Loader size={16} className="animate-spin" />}
                                        {editingDrink ? 'Save Changes' : 'Add Drink'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
