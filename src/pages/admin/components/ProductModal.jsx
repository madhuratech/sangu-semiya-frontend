import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import api from '../../../utils/api';
import { FiInfo, FiEdit3, FiImage, FiPlus, FiTrash2, FiChevronDown, FiWind, FiCheckCircle, FiClock, FiShield, FiTarget, FiZap, FiActivity, FiBriefcase, FiTrendingUp, FiBox, FiPackage } from 'react-icons/fi';

const ICON_OPTIONS = [
  { icon: <FiWind />, name: 'Wind' },
  { icon: <FiCheckCircle />, name: 'Check' },
  { icon: <FiClock />, name: 'Clock' },
  { icon: <FiShield />, name: 'Shield' },
  { icon: <FiTarget />, name: 'Target' },
  { icon: <FiZap />, name: 'Zap' },
  { icon: <FiActivity />, name: 'Activity' },
  { icon: <FiBriefcase />, name: 'Briefcase' },
  { icon: <FiTrendingUp />, name: 'Chart' },
  { icon: <FiBox />, name: 'Box' },
  { icon: <FiPackage />, name: 'Package' },
];

const DEFAULT_FEATURES = [
  { icon: '🌾', label: 'Premium Wheat Semolina' },
  { icon: '✨', label: 'No Bleach, No Artificial Additives' },
  { icon: '⏱️', label: 'Cooks in Just 5–7 Minutes' },
  { icon: '🛡️', label: 'Triple-Layer Fresh-Lock Packaging' },
];

const DEFAULT_NUTRITION = [
  { label: 'Energy', value: '360 kcal' },
  { label: 'Protein', value: '10.5 g' },
  { label: 'Carbohydrates', value: '77.2 g' },
  { label: 'Total Fat', value: '0.8 g' },
  { label: 'Dietary Fiber', value: '2.5 g' },
  { label: 'Sodium', value: '< 5 mg' },
];

const ProductModal = ({ isOpen, onClose, product, refreshProducts, onSuccess }) => {
  const [activeTab, setActiveTab] = useState('basic');
  const [formData, setFormData] = useState({
    name: '', sku: '', description: '', packSize: '', amazonLink: '',
    price: '', status: 'Active', category: 'General', variants: '', featured: false,
  });
  const [metadata, setMetadata] = useState({
    bannerHeadline: 'Pure Wheat.\nPerfect Texture.\nEvery Time.',
    features: DEFAULT_FEATURES,
    nutrition: DEFAULT_NUTRITION,
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchingPrice, setFetchingPrice] = useState(false);
  const [openIconPicker, setOpenIconPicker] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        description: product.description || '',
        packSize: product.packSize || '',
        amazonLink: product.amazonLink || '',
        price: product.price || '',
        status: product.status || 'Active',
        category: product.category || 'General',
        variants: product.variants || '',
        featured: product.featured || false,
      });
      const m = product.metadata || {};
      setMetadata({
        bannerHeadline: m.bannerHeadline || 'Pure Wheat.\nPerfect Texture.\nEvery Time.',
        features: m.features?.length > 0 ? m.features : DEFAULT_FEATURES,
        nutrition: m.nutrition?.length > 0 ? m.nutrition : DEFAULT_NUTRITION,
      });
      setExistingImages(product.images || []);
    } else {
      setFormData({ name: '', sku: '', description: '', packSize: '', amazonLink: '', price: '', status: 'Active', category: 'General', variants: '', featured: false });
      setMetadata({ bannerHeadline: 'Pure Wheat.\nPerfect Texture.\nEvery Time.', features: DEFAULT_FEATURES, nutrition: DEFAULT_NUTRITION });
      setExistingImages([]);
    }
    setSelectedFiles([]);
    setActiveTab('basic');
  }, [product, isOpen]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleFetchPrice = async () => {
    if (!formData.amazonLink) return alert('Please enter an Amazon URL first');
    setFetchingPrice(true);
    try {
      const res = await api.post('/products/fetch-amazon-price', { url: formData.amazonLink });
      if (res.data.price) setFormData(prev => ({ ...prev, price: res.data.price }));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to fetch price from Amazon.');
    } finally {
      setFetchingPrice(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('adminToken');
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    
    const cleanMetadata = { ...metadata };
    if (metadata.bannerImage instanceof File) {
      data.append('banner_image', metadata.bannerImage);
      delete cleanMetadata.bannerImage;
    }
    data.append('metadata', JSON.stringify(cleanMetadata));
    data.append('existing_images', JSON.stringify(existingImages));
    
    selectedFiles.forEach(file => data.append('images', file));
    try {
      const url = product
        ? `/products/${product.id || product._id}`
        : '/products';
      if (product) {
        await api.put(url, data);
        onSuccess('Product Updated Successfully');
      } else {
        await api.post(url, data);
        onSuccess('New Product Created');
      }
      refreshProducts();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const updateFeature = (i, key, val) => {
    const updated = [...metadata.features];
    updated[i] = { ...updated[i], [key]: val };
    setMetadata(m => ({ ...m, features: updated }));
  };
  const addFeature = () => setMetadata(m => ({ ...m, features: [...m.features, { icon: 'Check', label: '' }] }));
  const removeFeature = (i) => setMetadata(m => ({ ...m, features: m.features.filter((_, idx) => idx !== i) }));

  const updateNutrition = (i, key, val) => {
    const updated = [...metadata.nutrition];
    updated[i] = { ...updated[i], [key]: val };
    setMetadata(m => ({ ...m, nutrition: updated }));
  };
  const addNutrition = () => setMetadata(m => ({ ...m, nutrition: [...m.nutrition, { label: '', value: '' }] }));
  const removeNutrition = (i) => setMetadata(m => ({ ...m, nutrition: m.nutrition.filter((_, idx) => idx !== i) }));

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(prev => [...prev, ...files].slice(0, 10)); // Max 10 images
  };

  const removeSelectedFile = (i) => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i));
  const removeExistingImage = (i) => setExistingImages(prev => prev.filter((_, idx) => idx !== i));

  if (!isOpen) return null;

  const inputCls = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2.5 focus:border-primary outline-none transition-all placeholder:text-slate-300';
  const labelCls = 'text-[14px] font-medium text-slate-400 uppercase tracking-widest';

  return createPortal(
    <div style={{ position: 'fixed', inset: 0, zIndex: 99999, backgroundColor: 'rgba(15,23,42,0.5)' }}
      className="flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden border border-slate-100 font-sans flex flex-col" style={{ maxHeight: '90vh' }}>

        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center shrink-0">
          <h2 className="text-sm font-medium text-slate-800 tracking-tight">
            {product ? 'Edit Product' : 'Add New Product'}
          </h2>
          <button onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-full transition-colors">
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-slate-100 shrink-0">
          {['basic', 'content'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-3 text-[15px] font-medium uppercase tracking-widest transition-colors flex items-center justify-center gap-2 ${activeTab === tab ? 'text-primary border-b-2 border-primary' : 'text-slate-400 hover:text-slate-600'}`}>
              {tab === 'basic' ? <><FiInfo size={14} /> Basic Info</> : <><FiEdit3 size={14} /> Page Content</>}
            </button>
          ))}
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {activeTab === 'basic' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Product Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className={inputCls} placeholder="Product Name" />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>SKU (Internal Code)</label>
                  <input type="text" value={formData.sku} onChange={e => setFormData({ ...formData, sku: e.target.value })} className={inputCls} placeholder="e.g. SS-001" />
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelCls}>Brief Description</label>
                <textarea rows="2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className={inputCls + ' resize-none'} placeholder="Product short summary..." />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Category</label>
                  <input type="text" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className={inputCls} placeholder="e.g. Signature, Classic" />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Variants</label>
                  <input type="text" value={formData.variants} onChange={e => setFormData({ ...formData, variants: e.target.value })} className={inputCls} placeholder="e.g. Roasted, Plain" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Pack Sizes (comma-separated)</label>
                  <input type="text" value={formData.packSize} onChange={e => setFormData({ ...formData, packSize: e.target.value })} className={inputCls} placeholder="200g, 500g, 1kg" />
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Status</label>
                  <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className={inputCls + ' cursor-pointer bg-white'}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 py-1">
                <input type="checkbox" id="featured" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} className="w-4 h-4 text-primary border-slate-200 rounded" />
                <label htmlFor="featured" className="text-xs font-medium text-slate-600">Mark as Featured (shown on Homepage)</label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelCls}>Amazon Link</label>
                  <div className="flex gap-2">
                    <input type="url" value={formData.amazonLink} onChange={e => setFormData({ ...formData, amazonLink: e.target.value })} className="flex-1 text-sm border border-slate-200 rounded-lg px-3 py-2.5 outline-none transition-all placeholder:text-slate-300" placeholder="https://amazon.in/dp/..." />
                    <button type="button" onClick={handleFetchPrice} disabled={fetchingPrice}
                      className="px-3 bg-amber-500 text-white rounded-lg text-[14px] font-medium uppercase tracking-wide transition disabled:opacity-50 hover:bg-amber-600 shrink-0">
                      {fetchingPrice ? '...' : 'Fetch'}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className={labelCls}>Live Price</label>
                  <input type="text" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className={inputCls + ' font-medium text-primary'} placeholder="₹0.00" />
                </div>
              </div>

              <div className="space-y-3">
                <label className={labelCls}>Product Gallery (Max 10 Images)</label>
                <div className="grid grid-cols-4 gap-3">
                  {existingImages.map((img, i) => (
                    <div key={`existing-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-100 group">
                      <img src={img} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm">
                        <FiTrash2 size={10} />
                      </button>
                      <div className="absolute inset-0 bg-black/5 pointer-events-none" />
                    </div>
                  ))}
                  {selectedFiles.map((file, i) => (
                    <div key={`new-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                      <button type="button" onClick={() => removeSelectedFile(i)} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition shadow-sm">
                        <FiTrash2 size={10} />
                      </button>
                    </div>
                  ))}
                  {(existingImages.length + selectedFiles.length) < 10 && (
                    <label className="cursor-pointer aspect-square rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center hover:border-primary hover:bg-white transition text-slate-400 group">
                      <input type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
                      <FiPlus size={18} className="group-hover:text-primary transition-colors" />
                      <span className="text-[12px] font-medium uppercase mt-1">Add Image</span>
                    </label>
                  )}
                </div>
                <p className="text-[13px] text-slate-400 font-medium italic">Supports multiple JPG/PNG up to 2MB each. Drag & drop coming soon.</p>
              </div>
            </>
          )}

          {activeTab === 'content' && (
            <>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <div className="flex-1 space-y-1">
                      <label className={labelCls}>🖼️ Lifestyle Banner Headline</label>
                      <p className="text-[14px] text-slate-400">Large text over the banner image. Use line breaks.</p>
                      <textarea
                        rows="3"
                        value={metadata.bannerHeadline}
                        onChange={e => setMetadata(m => ({ ...m, bannerHeadline: e.target.value }))}
                        className={inputCls + ' resize-none font-medium'}
                        placeholder={'Pure Wheat.\nPerfect Texture.\nEvery Time.'}
                      />
                   </div>
                   <div className="ml-4 w-32 shrink-0">
                      <label className={labelCls}>Banner Image</label>
                      <div className="mt-1 border-2 border-dashed border-slate-200 rounded-xl aspect-[16/9] flex flex-col items-center justify-center bg-slate-50 overflow-hidden relative group">
                        {metadata.bannerImage ? (
                          <img src={typeof metadata.bannerImage === 'string' ? metadata.bannerImage : URL.createObjectURL(metadata.bannerImage)} className="w-full h-full object-cover" alt="Banner" />
                        ) : <FiImage className="text-slate-300" size={20} />}
                        <input type="file" onChange={e => setMetadata(m => ({ ...m, bannerImage: e.target.files[0] }))} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center">
                  <label className={labelCls}>⭐ Product Features (Mini List)</label>
                  <button type="button" onClick={addFeature} className="text-[14px] font-medium text-primary hover:underline flex items-center gap-1"><FiPlus /> Add Row</button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {metadata.features.map((f, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenIconPicker(openIconPicker === i ? null : i)}
                          className="w-12 h-10 border border-slate-200 rounded-xl bg-white flex items-center justify-center text-slate-600 hover:border-primary hover:text-primary transition shadow-sm"
                        >
                          {ICON_OPTIONS.find(o => o.name === f.icon)?.icon || <FiPackage />}
                        </button>
                        
                        {openIconPicker === i && (
                          <>
                            <div 
                              className="fixed inset-0 z-[100]" 
                              onClick={() => setOpenIconPicker(null)}
                            />
                            <div className="absolute top-11 left-0 z-[101] bg-white border border-slate-200 rounded-xl shadow-2xl p-3 grid grid-cols-4 gap-2 w-48 animate-fade-in ring-4 ring-slate-900/5">
                              {ICON_OPTIONS.map(opt => (
                                <button
                                  key={opt.name}
                                  type="button"
                                  onClick={() => {
                                    updateFeature(i, 'icon', opt.name);
                                    setOpenIconPicker(null);
                                  }}
                                  className={`w-9 h-9 flex items-center justify-center rounded-lg transition-all ${f.icon === opt.name ? 'bg-primary text-white' : 'hover:bg-slate-50 text-slate-400 hover:text-primary'}`}
                                  title={opt.name}
                                >
                                  {opt.icon}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <input type="text" value={f.label} onChange={e => updateFeature(i, 'label', e.target.value)}
                        className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary placeholder:text-slate-300" placeholder="Feature description..." />
                      <button type="button" onClick={() => removeFeature(i)} className="text-slate-300 hover:text-red-400 transition p-2">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Facts */}
              <div className="space-y-2 pt-2 pb-4">
                <div className="flex justify-between items-center">
                  <label className={labelCls}>📊 Nutrition Facts (per 100g)</label>
                  <button type="button" onClick={addNutrition} className="text-[14px] font-medium text-primary hover:underline flex items-center gap-1"><FiPlus /> Add Row</button>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {metadata.nutrition.map((n, i) => (
                    <div key={i} className="flex gap-2 items-center">
                      <input type="text" value={n.label} onChange={e => updateNutrition(i, 'label', e.target.value)}
                        className="flex-1 text-sm border border-slate-200 rounded-xl px-4 py-2 outline-none focus:border-primary" placeholder="e.g. Protein" />
                      <input type="text" value={n.value} onChange={e => updateNutrition(i, 'value', e.target.value)}
                        className="w-32 text-sm border border-slate-200 rounded-xl px-4 py-2 outline-none font-medium" placeholder="360 kcal" />
                      <button type="button" onClick={() => removeNutrition(i)} className="text-slate-300 hover:text-red-400 transition p-2">
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex gap-3 justify-end shrink-0">
          <button onClick={onClose} className="px-6 py-2.5 text-slate-500 font-medium text-xs border border-slate-200 rounded-lg hover:bg-slate-100 transition tracking-wide">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={loading}
            className="px-8 py-2.5 bg-primary text-white font-medium text-xs rounded-lg shadow-md shadow-red-100 hover:bg-red-700 transition-all tracking-wide disabled:opacity-60">
            {loading ? 'Saving...' : product ? 'Save Product' : 'Create Product'}
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default ProductModal;
